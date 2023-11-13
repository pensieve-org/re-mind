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
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Profile() {
  const { userDetails, setUserDetails, setSelectedEvent, setUserEvents } =
    useContext(AppContext);

  const handleLogout = async () => {
    setUserDetails({});
    setSelectedEvent({ images: {}, id: "" });
    setUserEvents({ ongoing: {}, past: {} });
    await AsyncStorage.clear();
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
        <Body style={{ paddingVertical: 20 }}>
          Hello, {userDetails.first_name}
        </Body>
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
