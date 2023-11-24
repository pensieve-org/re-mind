import React from "react";
import { StyleSheet, Text, TextStyle } from "react-native";
import theme from "../assets/theme";

interface SubtitleProps {
  size?: number;
  children?: React.ReactNode;
  style?: TextStyle;
}

const Subtitle: React.FC<SubtitleProps> = ({ size = 35, children, style }) => {
  return (
    <Text style={[styles.text, style, { fontSize: size }]}>{children}</Text>
  );
};

export default Subtitle;

const styles = StyleSheet.create({
  text: {
    color: theme.TEXT,
    letterSpacing: -0.408,
    fontFamily: "MontserratSemiBold",
  },
});
