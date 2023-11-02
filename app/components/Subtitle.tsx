import React from "react";
import { StyleSheet, Text } from "react-native";
import theme from "../assets/theme";

interface SubtitleProps {
  size?: number;
  children?: React.ReactNode;
}

const Subtitle: React.FC<SubtitleProps> = ({ size = 35, children }) => {
  return <Text style={[styles.text, { fontSize: size }]}>{children}</Text>;
};

export default Subtitle;

const styles = StyleSheet.create({
  text: {
    color: theme.TEXT,
    letterSpacing: -0.408,
    fontFamily: "MontserratSemiBold",
  },
});
