import React from "react";
import { StyleSheet, Text, TextStyle } from "react-native";
import theme from "../assets/theme";

interface SubtitleProps {
  size?: number;
  children?: React.ReactNode;
}

const Subtitle: React.FC<SubtitleProps> = ({ size = 35, children }) => {
  const textStyle: TextStyle = {
    fontSize: size,
    fontFamily: "MontserratSemiBold",
  };

  return <Text style={[styles.text, textStyle]}>{children}</Text>;
};

export default Subtitle;

const styles = StyleSheet.create({
  text: {
    color: theme.TEXT,
    letterSpacing: -0.408,
  },
});
