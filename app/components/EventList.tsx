import React from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import Body from "./Body";
import { EVENT_ICON_DIAMETER } from "../assets/constants";

interface Props {
  events: any[]; // might need to make this an object
  onPress?: (eventId) => void;
}

const EventList: React.FC<Props> = ({ events, onPress }) => {
  const handleOnPress = (eventId) => {
    onPress(eventId);
  };

  return (
    <View style={styles.container}>
      {events.map((event, index) => (
        <TouchableOpacity
          key={index}
          style={{
            paddingBottom: 10,
            alignItems: "center",
          }}
          onPress={() => handleOnPress(event.id)}
        >
          <View style={styles.imageContainer}>
            <Image source={{ uri: event.image }} style={styles.image} />
          </View>
          <Body style={styles.text}>{event.name}</Body>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
