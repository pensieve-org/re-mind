import React from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import Body from "./Body";
import {
  EVENT_ICON_DIAMETER,
  ICON_GAP,
  ICON_GAP_BOTTOM,
  ROW_ICONS,
} from "../assets/constants";

interface Props {
  events: any[]; // might need to make this an object
  onPress?: (eventId) => void;
}

const EventList: React.FC<Props> = ({ events, onPress }) => {
  const handleOnPress = (event) => {
    onPress(event);
  };

  return (
    <View style={styles.container}>
      {events.map((event, index) => (
        <TouchableOpacity
          key={index}
          style={{
            marginBottom: ICON_GAP_BOTTOM,
            marginRight: (index + 1) % ROW_ICONS === 0 ? 0 : ICON_GAP,
            alignItems: "center",
          }}
          onPress={() => handleOnPress(event)}
        >
          <View style={styles.imageContainer}>
            <Image source={{ uri: event.image }} style={styles.image} />
          </View>
          <Body style={styles.text} adjustsFontSizeToFit numberOfLines={1}>
            {event.name}
          </Body>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "flex-start",
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
    flexWrap: "wrap",
    width: EVENT_ICON_DIAMETER,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 100,
  },
});

export default EventList;
