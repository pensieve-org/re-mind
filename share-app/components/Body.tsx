import React from "react";
import { StyleSheet, Text, TextStyle } from "react-native";
import theme from "../assets/theme";

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
  const textStyle: TextStyle = {
    fontSize: size,
    fontFamily: italic ? "MontserratItalic" : "MontserratRegular",
  };

  return <Text style={[styles.text, textStyle, style]}>{children}</Text>;
};

export default Body;

const styles = StyleSheet.create({
  text: {
    color: theme.TEXT,
    letterSpacing: -0.408,
  },
});
