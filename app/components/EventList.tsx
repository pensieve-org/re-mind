import React from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import Body from "./Body";
import { EVENT_ICON_DIAMETER } from "../assets/constants";

interface Props {
  events: any[]; // might need to make this an object
  onPress?: (event) => void;
}

const EventList: React.FC<Props> = ({ events, onPress }) => {
  return (
    // TODO: add a pressable property that returns the event id of the clicked event. This will trigger the api call and load the right images for the event screen nav
    <View style={styles.container}>
      {events.map((event, index) => (
        <TouchableOpacity
          key={index}
          style={{ paddingBottom: 10 }}
          onPress={(event) => onPress(event)}
        >
          <View style={styles.imageContainer}>
            {/* This will have to be changed to event.url */}
            <Image source={{ uri: event.image }} style={styles.image} />
          </View>
          {/* This will have to be changed to event.name */}
          <Body style={styles.text}>test</Body>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  imageContainer: {
    width: EVENT_ICON_DIAMETER,
    height: EVENT_ICON_DIAMETER,
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
