import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import Body from "./Body";
import {
  EVENT_ICON_DIAMETER,
  ICON_GAP,
  ICON_GAP_BOTTOM,
  ROW_ICONS,
  ANIMATED_BORDER_RADIUS,
} from "../assets/constants";
import theme from "../assets/theme";
import ImageIcon from "../assets/image.svg";

import { AnimatedImage } from "../utils/AnimatedImage";

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
                overflow: "hidden",
              },
              event.isInvited && {
                borderWidth: 3,
                borderColor: theme.RED,
              },
            ]}
          >
            {event.thumbnail ? (
              <AnimatedImage
                source={{ uri: event.thumbnail }}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: ANIMATED_BORDER_RADIUS,
                }}
                sharedTransitionTag={`event-${event.eventId}`}
                cachePolicy={"memory-disk"}
              />
            ) : (
              <ImageIcon
                height={"50%"}
                width={"50%"}
                style={{ color: theme.PRIMARY }}
              />
            )}
            {event.isInvited && (
              <>
                <View
                  style={{
                    position: "absolute",
                    backgroundColor: `${theme.DARK}95`,
                    borderRadius: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 10,
                  }}
                >
                  <Body size={16} style={{ padding: 5 }}>
                    Invited
                  </Body>
                </View>
                <View style={styles.overlay} />
              </>
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 100,
  },
});

export default EventList;
