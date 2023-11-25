import React from "react";
import { StyleSheet, TextStyle } from "react-native";
import theme from "../assets/theme";
import { TextInput } from "react-native-gesture-handler";

interface SubtitleProps {
  size?: number;
  text?: string;
  style?: TextStyle;
  onChangeText?: (text: string) => void;
}

const Subtitle: React.FC<SubtitleProps> = ({
  size = 35,
  text,
  style,
  onChangeText,
}) => {
  return (
    <TextInput
      style={[styles.text, style, { fontSize: size }]}
      placeholder={text}
      placeholderTextColor={theme.TEXT}
      onChangeText={onChangeText}
    />
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
