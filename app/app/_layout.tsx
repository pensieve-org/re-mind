import { createContext, useState } from "react";
import { Slot } from "expo-router";
import { useFonts } from "expo-font";
import {
  Montserrat_400Regular,
  Montserrat_400Regular_Italic,
  Montserrat_600SemiBold,
} from "@expo-google-fonts/montserrat";

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

  return (
    <FontLoader>
      <UserContext.Provider
        value={{ name, setName, profilePicture, setProfilePicture }}
      >
        <Slot />
      </UserContext.Provider>
    </FontLoader>
  );
}

export const UserContext = createContext(null);
