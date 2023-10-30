import React from "react";
import { StyleSheet, Text, TextStyle } from "react-native";
import theme from "../assets/theme";

interface BodyProps {
  size?: number;
  children?: React.ReactNode;
  style?: TextStyle;
}

const Body: React.FC<BodyProps> = ({ style, size = 16, children }) => {
  return (
    <Text style={[styles.text, style, { fontSize: size }]}>{children}</Text>
  );
};

export default Body;

const styles = StyleSheet.create({
  text: {
    alignItems: "center",
    fontWeight: "400",
    fontFamily: "Montserrat",
    color: theme.TEXT,
    letterSpacing: -0.408,
  },
});
