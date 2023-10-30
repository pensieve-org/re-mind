import React, { useCallback } from "react";
import { StyleSheet, Text, TextStyle } from "react-native";
import theme from "../assets/theme";
import { useFonts, Montserrat_400Regular } from "@expo-google-fonts/montserrat";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

interface TitleProps {
  size?: number;
  children?: React.ReactNode;
}

const Title: React.FC<TitleProps> = ({ size = 55, children }) => {
  const [loadedFonts] = useFonts({
    MontserratRegular: Montserrat_400Regular,
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
    fontFamily: "MontserratRegular",
  };

  return (
    <Text style={[styles.text, textStyle]} onLayout={onLayoutRootView}>
      {children}
    </Text>
  );
};

export default Title;

const styles = StyleSheet.create({
  text: {
    color: theme.TEXT,
    letterSpacing: -0.408,
  },
});
