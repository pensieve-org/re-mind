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
  try {
    console.log("Checking image upload queue...");
    const photoUrisJson = await AsyncStorage.getItem("photoUris");
    const photoUris = photoUrisJson ? JSON.parse(photoUrisJson) : [];

    if (photoUris.length === 0) {
      return;
    }

    // TODO: add a time to photo object. if after that time, upload
    await uploadImagesToEvents(photoUris, liveEventIds);

    console.log(`Images uploaded`);

    await AsyncStorage.removeItem("photoUris");
  } catch (err) {
    console.log(err);
  }
};

const updatePhotos = async (insertedAssets: MediaLibrary.Asset[]) => {
  try {
    const newUris = insertedAssets.map((asset) => asset.uri);

    const existingUrisJson = await AsyncStorage.getItem("photoUris");
    const existingUris = existingUrisJson ? JSON.parse(existingUrisJson) : [];

    const combinedUris = [...existingUris, ...newUris];

    // TODO: add a Date.now()+15mins field with url for queueing
    await AsyncStorage.setItem("photoUris", JSON.stringify(combinedUris));
    console.log("Saved new photos to AsyncStorage");
  } catch (err) {
    console.log(err);
  }
};

export default function HomeLayout() {
  const [userDetails, setUserDetails] = useState<UserDetails>(
    {} as UserDetails
  );
  const [userEvents, setUserEvents] = useState<UserEvents>({} as UserEvents);
  const [selectedEvent, setSelectedEvent] = useState({});
  const [homeTabState, setHomeTabState] = useState<HomeTabState>("memories");
  const [isLive, setIsLive] = useState(false);
  const [liveEventIds, setLiveEventIds] = useState([]);

  useEffect(() => {
    let newSubscription: MediaLibrary.Subscription | null = null;
    let intervalId: NodeJS.Timeout;

    (async () => {
      try {
        if (isLive) {
          const { status } = await MediaLibrary.requestPermissionsAsync();
          if (status !== "granted") {
            console.log("User needs to grant permission to photos.");
            return;
          }
          newSubscription = MediaLibrary.addListener(
            async (event: MediaLibrary.MediaLibraryAssetsChangeEvent) => {
              await updatePhotos(event.insertedAssets);
            }
          );
          intervalId = setInterval(
            () => checkImageUploadQueue(liveEventIds),
            10000
          );
        } else {
          newSubscription?.remove();
          if (intervalId) {
            clearInterval(intervalId);
          }
        }
      } catch (err) {
        console.log(err);
      }
    })();

    return () => {
      newSubscription?.remove();
      if (intervalId) {
        clearInterval(intervalId);
      }
      AsyncStorage.removeItem("photoUris");
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
          homeTabState,
          setHomeTabState,
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
