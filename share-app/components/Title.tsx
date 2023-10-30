import React from "react";
import { StyleSheet, Text } from "react-native";
import theme from "../assets/theme";

interface TitleProps {
  size?: number;
  children?: React.ReactNode;
}

const Title: React.FC<TitleProps> = ({ size = 55, children }) => {
  return <Text style={[styles.text, { fontSize: size }]}>{children}</Text>;
};

export default Title;

const styles = StyleSheet.create({
  text: {
    alignItems: "center",
    fontWeight: "400",
    fontFamily: "Montserrat",
    color: theme.TEXT,
    letterSpacing: -0.408,
  },
});
