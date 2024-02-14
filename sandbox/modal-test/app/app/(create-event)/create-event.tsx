import React, { useContext, useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  View,
  Image,
  Alert as RNAlert,
  ActivityIndicator,
} from "react-native";
import { View as AnimatedView } from "react-native-animatable";
import { router, Link } from "expo-router";

import theme from "../../assets/theme";
import {
  ANIMATION_DURATION,
  ANIMATION_ENTRY,
  ANIMATION_EXIT,
  HEADER_ICON_DIMENSION,
  HORIZONTAL_PADDING,
  PROFILE_ICON_DIMENSION,
} from "../../assets/constants";

export default function CreateEvent() {
  return (
    <View style={styles.page}>
      <Link style={{ color: "#ffff", paddingTop: 200 }} href="/location-modal">
        location
      </Link>
      <Link style={{ color: "#ffff", paddingTop: 200 }} href="/">
        back
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: theme.BACKGROUND,
    flex: 1,
    alignItems: "center",
  },
  container: {
    flex: 1,
    marginHorizontal: HORIZONTAL_PADDING,
  },
  alertContainer: {
    alignItems: "center",
    height: 80,
  },
  loading: {
    width: "100%",
    justifyContent: "center",
    paddingBottom: 50,
  },
});
