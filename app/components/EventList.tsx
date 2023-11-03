import React from "react";
import { StyleSheet, View, Image, Dimensions } from "react-native";
import Body from "./Body";
import { HORIZONTAL_PADDING } from "../assets/constants";

interface Props {
  events: any[]; // might need to make this an object
}

// TODO: give an onpress property that triggers a navigation and returns the event id of the clicked event

const EventList: React.FC<Props> = ({ events }) => {
  return (
    // TODO: add a pressable property that returns the event id of the clicked event. This will trigger the api call and load the right images for the event screen nav
    <View style={styles.container}>
      {events.map((event, index) => (
        <View key={index}>
          <View style={styles.imageContainer}>
            {/* This will have to be changed to event.url */}
            <Image source={{ uri: event }} style={styles.image} />
          </View>
          {/* This will have to be changed to event.name */}
          <Body style={styles.text}>test</Body>
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
