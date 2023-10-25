import React from "react";
import { StyleSheet, Text } from "react-native";

interface TitleProps {
  size?: number;
  children?: React.ReactNode;
}

const Title: React.FC<TitleProps> = ({ size = 16, children }) => {
  return <Text style={[styles.text, { fontSize: size }]}>{children}</Text>;
};

export default Title;

const styles = StyleSheet.create({
  text: {
    alignItems: "center",
    fontWeight: "300",
    fontFamily: "Montserrat",
    color: "#FFFF",
    letterSpacing: 4,
  },
});
