import React, { useContext } from "react";
import { StyleSheet, View, Image } from "react-native";
import { router } from "expo-router";
import Header from "../components/Header";
import Body from "../components/Body";
import theme from "../assets/theme";
import {
  HORIZONTAL_PADDING,
  HEADER_ICON_DIMENSION,
  EVENT_IMAGE_WIDTH,
  IMAGE_GAP,
  ROW_IMAGES,
} from "../assets/constants";
import { AppContext } from "./_layout";
import BackArrow from "../assets/arrow-left.svg";
import { ScrollView } from "react-native-gesture-handler";

export default function Event() {
  const { name, profilePicture, selectedEvent } = useContext(AppContext);

  return (
    <View style={styles.page}>
      <Header
        imageLeft={
          <BackArrow
            height={HEADER_ICON_DIMENSION}
            width={HEADER_ICON_DIMENSION}
          />
        }
        onPressLeft={() => router.back()}
      />
      <ScrollView style={styles.container}>
        <Body style={{ paddingVertical: 20 }}>
          Event id: {selectedEvent.id}
        </Body>
        <View style={styles.imageContainer}>
          {selectedEvent.images.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image }}
              style={[
                styles.image,
                {
                  marginRight: (index + 1) % ROW_IMAGES === 0 ? 0 : IMAGE_GAP,
                },
              ]}
            />
          ))}
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
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  image: {
    width: EVENT_IMAGE_WIDTH,
    height: EVENT_IMAGE_WIDTH,
    marginBottom: IMAGE_GAP,
  },
});
