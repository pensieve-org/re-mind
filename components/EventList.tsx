import React from "react";
import { StyleSheet, View, Image, Dimensions } from "react-native";
import Body from "./Body";
import { HORIZONTAL_PADDING } from "../assets/constants";

interface Props {
  imageSources: any[];
  eventName: string;
}

// TODO: give an onpress property that triggers a navigation and returns the event id of the clicked event
// TODO: when the api is set up right, the only input should be an event object which has all the relevant data in it

const EventList: React.FC<Props> = ({ imageSources, eventName }) => {
  return (
    <View style={styles.container}>
      {imageSources.map((imageSource, index) => (
        <View key={index}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: imageSource }} style={styles.image} />
          </View>
          <Body style={styles.text}>{eventName}</Body>
        </View>
      ))}
    </View>
  );
};

const gap = 20;
const diameter =
  (Dimensions.get("window").width - 2 * HORIZONTAL_PADDING) / 2 - gap;

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  imageContainer: {
    width: diameter,
    height: diameter,
    borderRadius: 100,
  },
  text: {
    padding: 10,
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 100,
  },
});

export default EventList;
