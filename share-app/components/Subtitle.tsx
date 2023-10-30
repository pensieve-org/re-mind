import React, { useCallback } from "react";
import { StyleSheet, Text, TextStyle } from "react-native";
import theme from "../assets/theme";
import {
  useFonts,
  Montserrat_600SemiBold,
} from "@expo-google-fonts/montserrat";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

interface SubtitleProps {
  size?: number;
  children?: React.ReactNode;
}

const Subtitle: React.FC<SubtitleProps> = ({ size = 35, children }) => {
  const [loadedFonts] = useFonts({
    MontserratSemiBold: Montserrat_600SemiBold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (loadedFonts) {
      await SplashScreen.hideAsync();
    }
  }, [loadedFonts]);

  if (!loadedFonts) {
    return null;
  }

  const textStyle: TextStyle = {
    fontSize: size,
    fontFamily: "MontserratSemiBold",
  };

  return (
    <Text style={[styles.text, textStyle]} onLayout={onLayoutRootView}>
      {children}
    </Text>
  );
};

export default Subtitle;

const styles = StyleSheet.create({
  text: {
    color: theme.TEXT,
    letterSpacing: -0.408,
  },
});
