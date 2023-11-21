import React, { useContext, useState } from "react";
import { StyleSheet, View } from "react-native";
import { router } from "expo-router";
import Header from "../../components/Header";
import Body from "../../components/Body";
import theme from "../../assets/theme";
import {
  HORIZONTAL_PADDING,
  HEADER_ICON_DIMENSION,
  ANIMATION_DURATION,
} from "../../assets/constants";
import { AppContext } from "../_layout";
import BackArrow from "../../assets/arrow-left.svg";
import { View as AnimatedView } from "react-native-animatable";

export default function CreateEvent() {
  const { userDetails } = useContext(AppContext);
  const [animation, setAnimation] = useState("fadeIn");

  const navigateBack = () => {
    setAnimation("fadeOut");
    setTimeout(() => {
      router.back();
    }, ANIMATION_DURATION);
  };
  return (
    <View style={styles.page}>
      <Header
        imageLeft={
          <BackArrow
            height={HEADER_ICON_DIMENSION}
            width={HEADER_ICON_DIMENSION}
          />
        }
        onPressLeft={navigateBack}
      />
      <AnimatedView
        animation={animation}
        duration={ANIMATION_DURATION}
        style={styles.page}
      >
        <View style={styles.container}>
          <Body style={{ paddingVertical: 20 }}>Create event screen</Body>
        </View>
      </AnimatedView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: theme.BACKGROUND,
    flex: 1,
  },
  container: {
    flex: 1,
    marginHorizontal: HORIZONTAL_PADDING,
  },
});
