import React, { useState, useContext, useEffect } from "react";
import { StyleSheet, Image, View } from "react-native";
import { router } from "expo-router";
import Header from "../components/Header";
import Body from "../components/Body";
import theme from "../assets/theme";
import { HORIZONTAL_PADDING, HEADER_ICON_DIMENSION } from "../assets/constants";
import Subtitle from "../components/Subtitle";
import { UserContext } from "./_layout";
import Plus from "../assets/plus.svg";
import EventList from "../components/EventList";
import fetchImages from "../services/user.images";
import { ScrollView } from "react-native-gesture-handler";

export default function Home() {
  const { name, profilePicture } = useContext(UserContext);
  const [ongoingEvents, setOngoingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);

  useEffect(() => {
    fetchImages(1).then(setOngoingEvents).catch(console.error);
    fetchImages(5).then(setPastEvents).catch(console.error);
  }, []);

  return (
    <View style={styles.page}>
      <Header
        imageLeft={
          <View
            style={{
              width: HEADER_ICON_DIMENSION,
              height: HEADER_ICON_DIMENSION,
              borderRadius: 100,
              backgroundColor: profilePicture ? "transparent" : "blue",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {profilePicture ? (
              <Image
                source={{ uri: profilePicture }}
                style={{
                  width: HEADER_ICON_DIMENSION,
                  height: HEADER_ICON_DIMENSION,
                  borderRadius: 100,
                }}
              />
            ) : (
              <Body
                style={{
                  textAlign: "center",
                }}
              >
                {name[0]}
              </Body>
            )}
          </View>
        }
        onPressLeft={() => router.replace("/")}
        imageRight={
          <Plus height={HEADER_ICON_DIMENSION} width={HEADER_ICON_DIMENSION} />
        }
      />
      <ScrollView bounces={true}>
        <View style={styles.container}>
          <View style={{ paddingVertical: 10 }}>
            <Subtitle size={23}>memories</Subtitle>
          </View>
          <View style={{ paddingVertical: 10 }}>
            <Subtitle size={20}>ongoing</Subtitle>
          </View>

          <EventList imageSources={ongoingEvents} eventName="test" />

          <View style={{ paddingVertical: 10 }}>
            <Subtitle size={20}>past</Subtitle>
          </View>

          <EventList imageSources={pastEvents} eventName="test" />
        </View>
      </ScrollView>
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
    paddingBottom: 50,
  },
});
