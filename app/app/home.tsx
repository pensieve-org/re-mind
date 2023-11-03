import React, { useContext } from "react";
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
import { ScrollView } from "react-native-gesture-handler";

export default function Home() {
  const { name, profilePicture, events } = useContext(UserContext);

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
        onPressLeft={() => router.push("/profile")}
        imageRight={
          <Plus height={HEADER_ICON_DIMENSION} width={HEADER_ICON_DIMENSION} />
        }
        onPressRight={() => router.push("/create-event")}
      />
      <ScrollView>
        {/* TODO: add a scroll down to refresh (re call the api in layout by adding a refresh flag) */}
        <View style={styles.container}>
          <View style={{ paddingVertical: 20 }}>
            <Subtitle size={23}>memories</Subtitle>
          </View>
          <View style={{ paddingVertical: 20 }}>
            <Subtitle size={20}>ongoing</Subtitle>
          </View>

          <EventList imageSources={events.ongoing} eventName="test" />

          <View style={{ paddingVertical: 20 }}>
            <Subtitle size={20}>past</Subtitle>
          </View>

          <EventList imageSources={events.past} eventName="test" />
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
