import React, { createContext, useState, useEffect, useRef } from "react";
import { Slot } from "expo-router";
import { useFonts } from "expo-font";
import {
  Montserrat_400Regular,
  Montserrat_400Regular_Italic,
  Montserrat_600SemiBold,
} from "@expo-google-fonts/montserrat";
import * as MediaLibrary from "expo-media-library";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uploadImageToEvents from "../services/uploadImageToEvents";
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

export default function HomeLayout() {
  const [userDetails, setUserDetails] = useState<UserDetails>(
    {} as UserDetails
  );
  const [userEvents, setUserEvents] = useState<UserEvents>({} as UserEvents);
  const [selectedEvent, setSelectedEvent] = useState({});
  const [homeTabState, setHomeTabState] = useState<HomeTabState>("memories");
  const [isLive, setIsLive] = useState(false);
  const [liveEventIds, setLiveEventIds] = useState([]);
  const [imagesToUpload, setImagesToUpload] = useState(false);
  const uploadQueue = useRef([]);

  useEffect(() => {
    const uploadImages = async () => {
      if (uploadQueue.current.length === 0) {
        setImagesToUpload(false);
        return;
      }

      const photoUri = uploadQueue.current.shift();
      try {
        await uploadImageToEvents(photoUri, liveEventIds);
        uploadImages();
      } catch (err) {
        console.log(err);
      }
    };

    uploadImages();
  }, [imagesToUpload]);

  const updatePhotos = async (insertedAssets: MediaLibrary.Asset[]) => {
    try {
      const newUris = insertedAssets.map((asset) => asset.uri);
      uploadQueue.current.push(newUris);

      setImagesToUpload(true);
    } catch (err) {
      alert(err);
    }
  };

  useEffect(() => {
    let newSubscription: MediaLibrary.Subscription | null = null;

    (async () => {
      try {
        if (isLive) {
          const { status } = await MediaLibrary.requestPermissionsAsync();
          if (status !== "granted") {
            alert("User needs to grant permission to photos.");
            return;
          }
          newSubscription = MediaLibrary.addListener(
            async (event: MediaLibrary.MediaLibraryAssetsChangeEvent) => {
              await updatePhotos(event.insertedAssets);
            }
          );
        } else {
          newSubscription?.remove();
        }
      } catch (err) {
        alert(err);
      }
    })();

    return () => {
      newSubscription?.remove();
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
