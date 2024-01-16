import React, { createContext, useState, useEffect, useContext } from "react";
import { AppState } from "react-native";
import { Slot } from "expo-router";
import { useFonts } from "expo-font";
import {
  Montserrat_400Regular,
  Montserrat_400Regular_Italic,
  Montserrat_600SemiBold,
} from "@expo-google-fonts/montserrat";
import * as MediaLibrary from "expo-media-library";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uploadImageToEvent from "../apis/uploadImageToEvent";
import getUserEventsToUpload from "../apis/getUserEventsToUpload";
import clearEventUploadFlag from "../apis/clearEventUploadFlag";

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

export default function Layout() {
  const [userDetails, setUserDetails] = useState<UserDetails>(
    {} as UserDetails
  );
  const [userEvents, setUserEvents] = useState<UserEvents>({} as UserEvents);
  const [selectedEvent, setSelectedEvent] = useState({});
  const [homeTabState, setHomeTabState] = useState<HomeTabState>("memories");

  const handleAppStateChange = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") return;

    if (AppState.currentState !== "active") return;

    const eventsToUpload = await getUserEventsToUpload(userDetails.userId);
    if (eventsToUpload.length === 0) return;

    for (const item of eventsToUpload) {
      const { iosImageIds, event } = item;

      try {
        const imageAssets = await MediaLibrary.getAssetsAsync({
          first: 100,
          mediaType: "photo",
          createdAfter: event.startTime.toMillis(),
          createdBefore: event.endTime.toMillis(),
        });

        const imagesToUpload = imageAssets.assets.filter(
          (image) =>
            image.filename.includes("IMG") &&
            !iosImageIds.includes(image.filename)
        );

        for (const image of imagesToUpload) {
          await uploadImageToEvent(image, event.eventId);
        }

        if (event.status === "past") {
          await clearEventUploadFlag(event.eventId);
        }
      } catch (error) {
        alert(error);
      }
    }
  };

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, [userDetails]);

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
        <Slot />
      </AppContext.Provider>
    </FontLoader>
  );
}
