import React, { createContext, useState, useEffect } from "react";
import { Slot } from "expo-router";
import { useFonts } from "expo-font";
import {
  Montserrat_400Regular,
  Montserrat_400Regular_Italic,
  Montserrat_600SemiBold,
} from "@expo-google-fonts/montserrat";
import * as MediaLibrary from "expo-media-library";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uploadImagesToEvents from "../services/uploadImagesToEvents";
import EventListeners from "../services/EventListeners";

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

const checkImageUploadQueue = async (liveEventIds) => {
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
    await uploadImagesToEvents(urisToUpload, liveEventIds);

    console.log(`Images uploaded`);
    uploadedUris = [...uploadedUris, ...urisToUpload];

    // Save the uploadedUris to AsyncStorage
    await AsyncStorage.setItem("uploadedUris", JSON.stringify(uploadedUris));
  };

  // Call the function
  await uploadPhotos();
};

const updatePhotos = async (insertedAssets: MediaLibrary.Asset[]) => {
  const newUris = insertedAssets.map((asset) => asset.uri);

  // Get the existing URIs from AsyncStorage
  const existingUrisJson = await AsyncStorage.getItem("photoUris");
  const existingUris = existingUrisJson ? JSON.parse(existingUrisJson) : [];

  // Combine the existing URIs and new URIs, and remove duplicates
  const combinedUris = Array.from(new Set([...existingUris, ...newUris]));

  // Save the combined URIs to AsyncStorage
  await AsyncStorage.setItem("photoUris", JSON.stringify(combinedUris));
  console.log("Saved new photos to AsyncStorage");
};

export default function HomeLayout() {
  const [userDetails, setUserDetails] = useState({} as UserDetails);
  const [userEvents, setUserEvents] = useState({} as UserEvents);
  const [selectedEvent, setSelectedEvent] = useState({});
  const [subscription, setSubscription] =
    useState<MediaLibrary.Subscription | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [liveEventIds, setLiveEventIds] = useState([]);

  useEffect(() => {
    let newSubscription: MediaLibrary.Subscription | null = null;
    let intervalId: NodeJS.Timeout;

    (async () => {
      if (isLive) {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== "granted") {
          console.log("User needs to grant permission to photos.");
          return;
        }
        newSubscription = MediaLibrary.addListener(
          async (event: MediaLibrary.MediaLibraryAssetsChangeEvent) => {
            await updatePhotos(event.insertedAssets);
            await checkImageUploadQueue(liveEventIds);
          }
        );
        setSubscription(newSubscription);
        intervalId = setInterval(
          () => checkImageUploadQueue(liveEventIds),
          10000
        );
      } else {
        subscription?.remove();
        setSubscription(null);
      }
    })();

    return () => {
      newSubscription?.remove();
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isLive]);

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
        <EventListeners
          events={userEvents}
          setIsLive={setIsLive}
          setLiveEventIds={setLiveEventIds}
        />
        <Slot />
      </AppContext.Provider>
    </FontLoader>
  );
}
