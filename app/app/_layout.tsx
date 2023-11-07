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
