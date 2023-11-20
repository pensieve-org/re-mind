import React from "react";
import {
  StyleSheet,
  Text,
  TextStyle,
  GestureResponderEvent,
} from "react-native";
import theme from "../assets/theme";

interface BodyProps {
  size?: number;
  children?: React.ReactNode;
  style?: TextStyle;
  italic?: boolean;
  adjustsFontSizeToFit?: boolean;
  numberOfLines?: number;
  onPress?: (event: GestureResponderEvent) => void;
}

const Body: React.FC<BodyProps> = ({
  style,
  size = 16,
  children,
  italic = false,
  adjustsFontSizeToFit = false,
  numberOfLines = 1,
  onPress,
}) => {
  const textStyle: TextStyle = {
    fontSize: size,
    fontFamily: italic ? "MontserratItalic" : "MontserratRegular",
  };

  return (
    <Text
      style={[styles.text, textStyle, style]}
      adjustsFontSizeToFit={adjustsFontSizeToFit}
      numberOfLines={numberOfLines}
      onPress={onPress}
    >
      {children}
    </Text>
  );
};

export default Body;

const styles = StyleSheet.create({
  text: {
    color: theme.TEXT,
    letterSpacing: -0.408,
  },
});
