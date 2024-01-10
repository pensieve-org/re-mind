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
import uploadImageToEvents from "../apis/uploadImageToEvents";
import getUserEventsToUpload from "../apis/getUserEventsToUpload";

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
    if (AppState.currentState == "active") {
      const eventsToUpload = await getUserEventsToUpload(userDetails.userId);
      alert(JSON.stringify(eventsToUpload));

      // run a function to get all user events with upload true, also return the list of ios image ids already uploaded to that event
      // i.e. list of objects with eventId and images [{eventId: 1, images: [image1id, image2id, image3id]}, {eventId: 2, images: [image1id, image2id, image3id]}...]

      // for each event, go through all media library images that were uploaded between the start and end times of the event
      // check the images for the appropriate meta data, i.e. taken by the device, image uid not in uploaded image list
      // if the image has the appropriate meta data, upload it to the event

      // stop looping when an image is uploaded before the event start time
      // set uploadFlag = false, go to next event
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
