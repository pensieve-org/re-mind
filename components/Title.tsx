import React from "react";
import { StyleSheet, Text, TextStyle } from "react-native";
import theme from "../assets/theme";

interface TitleProps {
  size?: number;
  children?: React.ReactNode;
}

const Title: React.FC<TitleProps> = ({ size = 55, children }) => {
  const textStyle: TextStyle = {
    fontSize: size,
    fontFamily: "MontserratRegular",
  };

  return <Text style={[styles.text, textStyle]}>{children}</Text>;
};

export default Title;

const styles = StyleSheet.create({
  text: {
    color: theme.TEXT,
    letterSpacing: -0.408,
  },
});
