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
      // alert(JSON.stringify(eventsToUpload));

      if (eventsToUpload.length === 0) {
        alert("No events to upload");
        return;
      }

      for (const item of eventsToUpload) {
        const eventImagesIosId = item.images.map((image) => image.iosId);
        const event = item.event;

        // alert(JSON.stringify(eventImagesIosId));
        // alert(JSON.stringify(event));

        try {
          const { status } = await MediaLibrary.requestPermissionsAsync();
          if (status === "granted") {
            const images = await MediaLibrary.getAssetsAsync({
              first: 100,
              mediaType: "photo",
              createdAfter: event.startTime.toMillis(),
              createdBefore: event.endTime.toMillis(),
            });
            alert(JSON.stringify(images));

            if (images.length === 0) {
              alert("No images to upload");
              continue;
            }

            const deviceImages = images.assets.filter((image) =>
              image.filename.includes("IMG")
            );

            alert(`device images: ${deviceImages.length}`);

            for (const image of deviceImages) {
              if (eventImagesIosId.includes(image.filename)) {
                continue;
              }
              const imageDetails = await MediaLibrary.getAssetInfoAsync(image);
              alert(imageDetails);
              // TODO: filter for metadata
              await uploadImageToEvent(
                image.uri,
                image.filename,
                event.eventId
              );
            }
          }
        } catch (error) {
          alert(error);
        }
      }

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
