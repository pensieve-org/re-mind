import React from "react";
import { StyleSheet, Pressable, View } from "react-native";
import { Link } from "expo-router";
import Body from "./Body";

interface ButtonProps {
  textSize?: number;
  children?: React.ReactNode;
  onPress?: () => void;
  route?: string;
  fill?: string;
  textColor?: string;
}

const Button: React.FC<ButtonProps> = ({
  textSize = 16,
  children,
  onPress,
  route,
  fill = "transparent",
  textColor = "white",
}) => {
  return (
    <View style={styles.container}>
      <Link
        style={[styles.button, { backgroundColor: fill }]}
        href={route}
        asChild
      >
        <Pressable onPress={onPress}>
          <Body style={{ color: textColor }} size={textSize}>
            {children}
          </Body>
        </Pressable>
      </Link>
    </View>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
  container: {
    width: "100%",
    paddingVertical: 10,
  },
});
