import React from "react";
import { StyleSheet, Text, View, TextStyle } from "react-native";

interface TitleProps {
  style?: TextStyle;
  size?: number;
  children?: React.ReactNode;
}

const Title: React.FC<TitleProps> = ({ size = 16, style, children }) => {
  return (
    <Text style={[styles.text, style, { fontSize: size }]}>{children}</Text>
  );
};

export default Title;

const styles = StyleSheet.create({
  text: {
    alignItems: "center",
    padding: 24,
  },
});
