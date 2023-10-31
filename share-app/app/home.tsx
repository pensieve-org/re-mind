import React, { useState, useContext } from "react";
import { StyleSheet, Image, View } from "react-native";
import { router } from "expo-router";
import Header from "../components/Header";
import Body from "../components/Body";
import theme from "../assets/theme";
import { HORIZONTAL_PADDING } from "../assets/constants";
import Subtitle from "../components/Subtitle";
import { UserContext } from "./_layout";

export default function Home() {
  const { name, profilePicture } = useContext(UserContext);

  return (
    <View style={styles.page}>
      <Header
        imageLeft={
          <View
            style={{
              width: 30,
              height: 30,
              borderRadius: 100,
              backgroundColor: "blue",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Body
              style={{
                textAlign: "center",
              }}
            >
              {name[0]}
            </Body>
          </View>
        }
        onPressLeft={() => router.replace("/")}
        imageRight={<Image source={require("../assets/plus.png")} />}
      />
      <View style={styles.container}>
        <View style={{ paddingVertical: 10 }}>
          <Subtitle size={23}>memories</Subtitle>
        </View>
        <View style={{ paddingVertical: 10 }}>
          <Subtitle size={20}>ongoing</Subtitle>
        </View>
        <View style={{ paddingVertical: 10 }}>
          <Subtitle size={20}>past</Subtitle>
        </View>
        {/* TODO: render profile picture image */}
        <View style={{ paddingVertical: 10, borderRadius: 100 }}>
          <Image
            source={{ uri: profilePicture }}
            style={{ width: 30, height: 30 }}
          />
        </View>
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
