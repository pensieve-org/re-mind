import React from "react";
import { StyleSheet, Pressable } from "react-native";
import { Link } from "expo-router";
import Body from "./Body";

interface ButtonProps {
  textSize?: number;
  children?: React.ReactNode;
  onPress?: () => void; // Updated type for onPress
  route?: String;
}

const Button: React.FC<ButtonProps> = ({
  textSize = 16,
  children,
  onPress,
  route,
}) => {
  return (
    <Link href={route} asChild>
      <Pressable onPress={onPress} style={styles.button}>
        <Body size={textSize}>{children}</Body>
      </Pressable>
    </Link>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#FFFF",
  },
});
