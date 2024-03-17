import React, { useEffect } from "react";
import { AppState } from "react-native";
import { Stack } from "expo-router";
import theme from "../../assets/theme";
import handleImageUpload from "../../utils/handleImageUpload";
import { ANIMATION_DURATION } from "../../assets/constants";
import Header from "../../components/Header";
import { useHeaderProps } from "../../hooks/useHeaderProps";

export default function Layout() {
  const headerProps = useHeaderProps();
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
        presentation: "card",
        animation: "fade",
        animationDuration: ANIMATION_DURATION,
        headerStyle: { backgroundColor: theme.BACKGROUND },

        header: () => <Header {...headerProps} />,
      }}
    >
      <Stack.Screen
        name="(create-event)/location-modal"
        options={{
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
