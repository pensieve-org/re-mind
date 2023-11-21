import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View as AnimatedView } from "react-native-animatable";

import Body from "../../components/Body";
import Button from "../../components/Button";
import Title from "../../components/Title";

import Logo from "../../assets/logo.svg";
import theme from "../../assets/theme";

import { ANIMATION_DURATION, HORIZONTAL_PADDING } from "../../assets/constants";

export default function Page() {
  const insets = useSafeAreaInsets();
  const [animation, setAnimation] = useState("fadeIn");

  const navigate = (route) => {
    setAnimation("fadeOut");
    setTimeout(() => {
      router.push(route);
    }, ANIMATION_DURATION);
  };

  return (
    <View style={styles.page}>
      <StatusBar style="light" />
      <AnimatedView
        animation={animation}
        duration={ANIMATION_DURATION}
        style={styles.page}
      >
        <View style={[styles.container, { paddingTop: insets.top }]}>
          <View style={styles.topContainer}>
            <Title size={55}>re:mind</Title>
            <Body size={20}>memory capture</Body>
          </View>

          <View style={styles.image}>
            <Logo width={400} height={400} />
          </View>

          <View style={styles.bottomContainer}>
            <View style={styles.buttonContainer}>
              <Button onPress={() => navigate("/login")}>login</Button>
              <Button onPress={() => navigate("/register")}>sign up</Button>
            </View>
          </View>
        </View>
      </AnimatedView>
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
