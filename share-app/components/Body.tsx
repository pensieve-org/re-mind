import React, { useCallback } from "react";
import { StyleSheet, Text, TextStyle } from "react-native";
import theme from "../assets/theme";
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_400Regular_Italic,
} from "@expo-google-fonts/montserrat";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

interface BodyProps {
  size?: number;
  children?: React.ReactNode;
  style?: TextStyle;
  italic?: boolean;
}

const Body: React.FC<BodyProps> = ({
  style,
  size = 16,
  children,
  italic = false,
}) => {
  const [loadedFonts] = useFonts({
    MontserratRegular: Montserrat_400Regular,
    MontserratItalic: Montserrat_400Regular_Italic,
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
    fontFamily: italic ? "MontserratItalic" : "MontserratRegular",
  };

  return (
    <Text style={[styles.text, textStyle, style]} onLayout={onLayoutRootView}>
      {children}
    </Text>
  );
};

export default Body;

const styles = StyleSheet.create({
  text: {
    color: theme.TEXT,
    letterSpacing: -0.408,
  },
});
