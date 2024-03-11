import React, { memo } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Title from "./Title";
import theme from "../assets/theme";
import { HEADER_ICON_DIMENSION } from "../assets/constants";

export interface HeaderProps {
  onPressLeft?: () => void;
  onPressRight?: () => void;
  imageLeft?: React.ReactNode;
  imageRight?: React.ReactNode;
}

const renderIcon = (
  icon: React.ReactNode,
  onPress: (() => void) | undefined,
  position: "left" | "right"
) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.iconWrapper, styles[position]]}
    accessibilityLabel={position === "left" ? "Left Icon" : "Right Icon"}
  >
    {icon}
  </TouchableOpacity>
);

const Header: React.FC<HeaderProps> = memo(
  ({ onPressLeft, onPressRight, imageLeft, imageRight }) => {
    const insets = useSafeAreaInsets();

    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar style="light" />
        <View style={styles.inLine}>
          {imageLeft && renderIcon(imageLeft, onPressLeft, "left")}
          <View style={styles.titleWrapper}>
            <Title size={30}>re:mind</Title>
          </View>
          {imageRight && renderIcon(imageRight, onPressRight, "right")}
        </View>
      </View>
    );
  }
);

export default Header;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 10,
    backgroundColor: theme.BACKGROUND,
  },
  inLine: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  iconWrapper: {
    position: "absolute",
    height: HEADER_ICON_DIMENSION,
    width: HEADER_ICON_DIMENSION,
    overflow: "hidden",
    borderRadius: 100,
  },
  left: {
    left: 28,
  },
  right: {
    right: 28,
  },
  titleWrapper: {
    alignItems: "center",
  },
});
