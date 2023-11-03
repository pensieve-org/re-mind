import React from "react";
import { StyleSheet, Pressable, View } from "react-native";
import Body from "./Body";
import theme from "../assets/theme";
import { CORNER_RADIUS } from "../assets/constants";

interface ButtonProps {
  textSize?: number;
  children?: React.ReactNode;
  onPress?: () => void;
  fill?: string;
  textColor?: string;
}

const Button: React.FC<ButtonProps> = ({
  textSize = 16,
  children,
  onPress,
  fill = "transparent",
  textColor = theme.TEXT,
}) => {
  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.button, { backgroundColor: fill }]}
        onPress={onPress}
      >
        <Body style={{ color: textColor }} size={textSize}>
          {children}
        </Body>
      </Pressable>
    </View>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    width: "100%",
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.PRIMARY,
    borderRadius: CORNER_RADIUS,
  },
  container: {
    width: "100%",
    paddingVertical: 10,
  },
});
