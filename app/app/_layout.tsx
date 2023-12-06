import React, { createContext, useState, useEffect } from "react";
import { Slot } from "expo-router";
import { useFonts } from "expo-font";
import {
  Montserrat_400Regular,
  Montserrat_400Regular_Italic,
  Montserrat_600SemiBold,
} from "@expo-google-fonts/montserrat";
import * as MediaLibrary from "expo-media-library";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uploadImagesToEvents from "../services/uploadImagesToEvents";

export const AppContext = createContext(null);

function FontLoader({ children }) {
  const [loadedFonts] = useFonts({
    MontserratRegular: Montserrat_400Regular,
    MontserratItalic: Montserrat_400Regular_Italic,
    MontserratSemiBold: Montserrat_600SemiBold,
  });

  if (!loadedFonts) {
    return null;
  }

  return children;
}

const BACKGROUND_FETCH_TASK = "background-fetch";

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  console.log(`Got background fetch call at date: ${new Date().toISOString()}`);
  try {
    const startJson = await AsyncStorage.getItem("start");
    const start = startJson ? JSON.parse(startJson) : Date.now();

    const updated = await updatePhotos(start);
    await checkImageUploadQueue();

    if (updated) {
      console.log(`Updated photos at date: ${new Date().toISOString()}`);
      return BackgroundFetch.BackgroundFetchResult.NewData;
    } else {
      console.log(`No new Images: ${new Date().toISOString()}`);
      return BackgroundFetch.BackgroundFetchResult.NoData;
    }
  } catch (error) {
    console.log(error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

const checkImageUploadQueue = async () => {
  console.log("Checking image upload queue...");
  const uploadPhotos = async () => {
    // Get photoUris
    const photoUrisJson = await AsyncStorage.getItem("photoUris");
    const photoUris = photoUrisJson ? JSON.parse(photoUrisJson) : [];

    // Get uploadedUris
    const uploadedUrisJson = await AsyncStorage.getItem("uploadedUris");
    let uploadedUris = uploadedUrisJson ? JSON.parse(uploadedUrisJson) : [];

    // Find the URIs of the photos that haven't been uploaded yet
    const urisToUpload = photoUris.filter(
      (uri: string) => !uploadedUris.includes(uri)
    );

    if (urisToUpload.length === 0) {
      return;
    }

    // Upload the photos and add the URIs to the uploadedUris array
    await uploadImagesToEvents("userId", urisToUpload, [
      "fSz4WrzECr25VzBmWNvW",
    ]);

    console.log(`Images uploaded`);
    uploadedUris = [...uploadedUris, ...urisToUpload];

    // Save the uploadedUris to AsyncStorage
    await AsyncStorage.setItem("uploadedUris", JSON.stringify(uploadedUris));
  };

  // Call the function
  await uploadPhotos();
};

const updatePhotos = async (start: number) => {
  const { assets } = await MediaLibrary.getAssetsAsync({
    mediaType: "photo",
    sortBy: ["creationTime"],
  });

  const newAssets = assets.filter((asset) => asset.creationTime > start);

  if (newAssets.length > 0) {
    const newUris = newAssets.reverse().map((asset) => asset.uri);

    // Get the existing URIs from AsyncStorage
    const existingUrisJson = await AsyncStorage.getItem("photoUris");
    const existingUris = existingUrisJson ? JSON.parse(existingUrisJson) : [];

    // Combine the existing URIs and new URIs, and remove duplicates
    const combinedUris = Array.from(new Set([...existingUris, ...newUris]));

    // Save the combined URIs to AsyncStorage
    await AsyncStorage.setItem("photoUris", JSON.stringify(combinedUris));
    console.log("Saved new photos to AsyncStorage");
    return true;
  }
  return false;
};

export default function HomeLayout() {
  const [userDetails, setUserDetails] = useState({});
  const [userEvents, setUserEvents] = useState({});
  const [selectedEvent, setSelectedEvent] = useState({});
  const [isListening, setIsListening] = useState(false);
  const [subscription, setSubscription] =
    useState<MediaLibrary.Subscription | null>(null);
  const [start, setStart] = useState<number>(Date.now());

  useEffect(() => {
    let newSubscription: MediaLibrary.Subscription | null = null;
    let intervalId: NodeJS.Timeout;

    if (isListening) {
      newSubscription = MediaLibrary.addListener(() => updatePhotos(start));
      setSubscription(newSubscription);
      intervalId = setInterval(checkImageUploadQueue, 5000);
    }

    return () => {
      newSubscription?.remove();
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isListening]);

  // TODO: this should be toggled based on firebase push notifications
  const toggleListener = () => {
    if (isListening) {
      subscription?.remove();
      setSubscription(null);
      try {
        BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
        console.log("Background fetch unregistered");
      } catch (err) {
        console.log("Background fetch failed to unregister");
      }
    } else {
      setStart(Date.now());
      AsyncStorage.setItem("start", JSON.stringify(Date.now()));
      try {
        BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
          minimumInterval: 60,
          stopOnTerminate: false,
          startOnBoot: true,
        });
        console.log("Background fetch registered");
      } catch (err) {
        console.log("Background fetch failed to register");
      }
    }

    setIsListening(!isListening);
  };

  // TODO: change this so it only happens when noti comes through
  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        console.log("User needs to grant permission to photos.");
        return;
      }

      setStart(Date.now());
      AsyncStorage.setItem("start", JSON.stringify(Date.now()));
      try {
        BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
          minimumInterval: 60,
          stopOnTerminate: false,
          startOnBoot: true,
        });
        console.log("Background fetch registered");
      } catch (err) {
        console.log("Background fetch failed to register");
      }

      setIsListening(true);
    })();
  }, []);

  return (
    <FontLoader>
      <AppContext.Provider
        value={{
          userDetails,
          setUserDetails,
          userEvents,
          setUserEvents,
          selectedEvent,
          setSelectedEvent,
        }}
      >
        <Slot />
      </AppContext.Provider>
    </FontLoader>
  );
}
