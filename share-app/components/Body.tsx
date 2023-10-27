import React from "react";
import { StyleSheet, Text, TextStyle } from "react-native";

interface TitleProps {
  size?: number;
  children?: React.ReactNode;
  style?: TextStyle;
}

const Body: React.FC<TitleProps> = ({ style, size = 16, children }) => {
  return (
    <Text style={[styles.text, style, { fontSize: size }]}>{children}</Text>
  );
};

export default Body;

const styles = StyleSheet.create({
  text: {
    alignItems: "center",
    fontWeight: "300",
    fontFamily: "Montserrat",
    color: "#FFFF",
    letterSpacing: 1,
  },
});
