import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Body from "../../components/Body";
import Button from "../../components/Button";
import Title from "../../components/Title";

import Logo from "../../assets/logo.svg";
import theme from "../../assets/theme";

import { HORIZONTAL_PADDING } from "../../assets/constants";

export default function Page() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.page}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.topContainer}>
          <Title size={55}>re:mind</Title>
          <Body size={20}>memory capture</Body>
        </View>

        <View style={styles.image}>
          <Logo width={400} height={400} style={{ color: theme.PRIMARY }} />
        </View>

        <View style={styles.bottomContainer}>
          <View style={styles.buttonContainer}>
            <Button onPress={() => router.push("/login")}>login</Button>
            <Button onPress={() => router.push("/register")}>sign up</Button>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: theme.BACKGROUND,
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: HORIZONTAL_PADDING,
  },
  topContainer: {
    alignItems: "center",
  },
  bottomContainer: {
    alignItems: "center",
    paddingBottom: 100,
  },
  buttonContainer: {
    width: "100%",
  },
  image: {
    alignSelf: "center",
  },
});
