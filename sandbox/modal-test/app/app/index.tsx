import React, { useState } from "react";
import { StyleSheet, View, Button } from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View as AnimatedView } from "react-native-animatable";
import theme from "../assets/theme";

import {
  ANIMATION_DURATION,
  ANIMATION_ENTRY,
  ANIMATION_EXIT,
  HORIZONTAL_PADDING,
} from "../assets/constants";

export default function Page() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.page}>
      <StatusBar style="light" />

      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.bottomContainer}>
          <View style={styles.buttonContainer}>
            <Button
              onPress={() => router.push("/create-event")}
              title="modal page"
            />
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
