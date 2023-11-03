import { createContext, useEffect, useState } from "react";
import { Slot } from "expo-router";
import { useFonts } from "expo-font";
import {
  Montserrat_400Regular,
  Montserrat_400Regular_Italic,
  Montserrat_600SemiBold,
} from "@expo-google-fonts/montserrat";
import getEvents from "../services/get.events";

export const UserContext = createContext(null);

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
  const [events, setEvents] = useState({ ongoing: [], past: [] });

  async function loadImages() {
    const ongoing = await getEvents(1);
    const past = await getEvents(5);
    setEvents({ ongoing, past });
  }

  useEffect(() => {
    loadImages();
  }, []); // TODO: things you put in here will make the use effect run whenever they change, put a flag in here to check when an event changes for a user

  return (
    <FontLoader>
      <UserContext.Provider
        value={{
          name,
          setName,
          profilePicture,
          setProfilePicture,
          events,
          setEvents,
        }}
      >
        <Slot />
      </UserContext.Provider>
    </FontLoader>
  );
}
