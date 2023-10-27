import React from "react";
import { StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";
import Title from "./Title";

interface HeaderProps {
  onPressLeft?: () => void;
  onPressRight?: () => void;
  routeLeft?: string;
  routeRight?: string;
  imageLeft?: React.ReactNode;
  imageRight?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({
  onPressLeft,
  onPressRight,
  routeLeft = "",
  routeRight = "",
  imageLeft,
  imageRight,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <>
      <StatusBar style="light" />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.inLine}>
          <View style={[styles.iconWrapper, { left: 20 }]}>
            {imageLeft && (
              <Link href={routeLeft} asChild>
                <TouchableOpacity onPress={onPressLeft}>
                  {imageLeft}
                </TouchableOpacity>
              </Link>
            )}
          </View>

          <View style={styles.titleWrapper}>
            <Title size={30}>re:mind</Title>
          </View>

          <View style={[styles.iconWrapper, { right: 20 }]}>
            {imageRight && (
              <Link href={routeRight} asChild>
                <TouchableOpacity onPress={onPressRight}>
                  {imageRight}
                </TouchableOpacity>
              </Link>
            )}
          </View>
        </View>
      </View>
    </>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 10,
    backgroundColor: "black",
  },
  inLine: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  iconWrapper: {
    position: "absolute",
  },
  titleWrapper: {
    alignItems: "center",
  },
});
