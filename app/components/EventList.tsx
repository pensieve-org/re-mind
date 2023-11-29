import React from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import Body from "./Body";
import {
  EVENT_ICON_DIAMETER,
  ICON_GAP,
  ICON_GAP_BOTTOM,
  ROW_ICONS,
} from "../assets/constants";
import theme from "../assets/theme";
import ImageIcon from "../assets/image.svg";

interface Props {
  events: any[];
  onPress?: (event) => void;
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
          <View
            style={[
              styles.imageContainer,
              {
                backgroundColor: event.thumbnail
                  ? "transparent"
                  : theme.PLACEHOLDER,
                alignItems: "center",
                justifyContent: "center",
              },
            ]}
          >
            {event.thumbnail ? (
              <Image source={{ uri: event.thumbnail }} style={styles.image} />
            ) : (
              <ImageIcon
                height={EVENT_ICON_DIAMETER - 80}
                width={EVENT_ICON_DIAMETER - 80}
                style={{ color: theme.PRIMARY }}
              />
            )}
          </View>
          <Body style={styles.text} adjustsFontSizeToFit numberOfLines={1}>
            {event.eventName}
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
