import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";
import { router } from "expo-router";
import Header from "../components/Header";
import Body from "../components/Body";
import theme from "../assets/theme";
import { HORIZONTAL_PADDING, HEADER_ICON_DIMENSION } from "../assets/constants";
import { AppContext } from "./_layout";
import BackArrow from "../assets/arrow-left.svg";
import Button from "../components/Button";

export default function Profile() {
  const {
    setName,
    setProfilePicture,
    name,
    profilePicture,
    setSelectedEvent,
    setEvents,
  } = useContext(AppContext);

  const handleLogout = () => {
    setName("");
    setProfilePicture("");
    setSelectedEvent({ images: {}, id: "" });
    setEvents({ ongoing: {}, past: {} });
    router.replace("/");
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
        onPressLeft={() => router.replace("/home")}
      />
      <View style={styles.container}>
        <Body style={{ paddingVertical: 20 }}>Hello, {name}</Body>
        <Button
          fill={theme.TEXT}
          textColor={theme.BACKGROUND}
          onPress={handleLogout}
        >
          logout
        </Button>
      </View>
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
