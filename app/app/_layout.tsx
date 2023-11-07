import { createContext, useEffect, useState } from "react";
import { Slot } from "expo-router";
import { useFonts } from "expo-font";
import {
  Montserrat_400Regular,
  Montserrat_400Regular_Italic,
  Montserrat_600SemiBold,
} from "@expo-google-fonts/montserrat";
import getEvents from "../services/get.events";

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
  const [name, setName] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [events, setEvents] = useState({ ongoing: {}, past: {} });
  const [selectedEvent, setSelectedEvent] = useState({ images: {}, id: "" });

  async function loadImages() {
    const ongoingEvents = await getEvents(1);
    const pastEvents = await getEvents(5);

    const ongoing = ongoingEvents.map((image, index) => ({
      image: image,
      id: `ongoing-${index}`,
    }));
    const past = pastEvents.map((image, index) => ({
      image: image,
      id: `past-${index}`,
    }));
    setEvents({ ongoing, past });
  }

  useEffect(() => {
    loadImages();
  }, []); // TODO: things you put in here will make the use effect run whenever they change, put a refresh flag in here triggered in the home screen

  return (
    <FontLoader>
      <AppContext.Provider
        value={{
          name,
          setName,
          profilePicture,
          setProfilePicture,
          events,
          setEvents,
          selectedEvent,
          setSelectedEvent,
        }}
      >
        <Slot />
      </AppContext.Provider>
    </FontLoader>
  );
}
