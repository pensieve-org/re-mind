import React, { useEffect } from "react";
import { AppState } from "react-native";
import { Stack, router } from "expo-router";
import Title from "../../components/Title";
import theme from "../../assets/theme";
import { HEADER_MARGIN, HEADER_ICON_DIMENSION } from "../../assets/constants";
import { TouchableOpacity } from "react-native";
import BackArrow from "../../assets/arrow-left.svg";
import handleImageUpload from "../../utils/handleImageUpload";
import { ANIMATION_DURATION } from "../../assets/constants";

export default function Layout() {
  useEffect(() => {
    const subscription = AppState.addEventListener("change", () =>
      handleImageUpload(5)
    );

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        gestureEnabled: false,
        animation: "fade",
        animationDuration: ANIMATION_DURATION,
        headerStyle: { backgroundColor: theme.BACKGROUND },
        headerTitle: () => <Title size={30}>re:mind</Title>,
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              width: HEADER_ICON_DIMENSION,
              height: HEADER_ICON_DIMENSION,
              borderRadius: 100,
              backgroundColor: "transparent",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: HEADER_MARGIN,
            }}
          >
            <BackArrow
              height={HEADER_ICON_DIMENSION}
              width={HEADER_ICON_DIMENSION}
              style={{ color: theme.PRIMARY }}
            />
          </TouchableOpacity>
        ),
      }}
    />
  );
}
