import React, { createContext, useState } from "react";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import {
  Montserrat_400Regular,
  Montserrat_400Regular_Italic,
  Montserrat_600SemiBold,
} from "@expo-google-fonts/montserrat";
import { StatusBar } from "expo-status-bar";
import { ANIMATION_DURATION } from "../assets/constants";

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
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "fade",
            gestureEnabled: false,
            animationDuration: ANIMATION_DURATION,
          }}
        />
      </AppContext.Provider>
    </FontLoader>
  );
}
