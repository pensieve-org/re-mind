import React from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import Body from "./Body";
import {
  EVENT_ICON_DIAMETER,
  ICON_GAP,
  ICON_GAP_BOTTOM,
  ROW_ICONS,
  ANIMATED_BORDER_RADIUS,
} from "../assets/constants";
import theme from "../assets/theme";
import moment from "moment";
import Subtitle from "./Subtitle";
import Animated from "react-native-reanimated";

interface Props {
  events: any[];
  onPress?: (event) => void;
}

const Calendar: React.FC<Props> = ({ events, onPress }) => {
  const groupEventsByYearAndMonth = (events) => {
    events.sort((a, b) => a.startTime.toDate() - b.startTime.toDate());

    const groups = {};
    events.forEach((event) => {
      const date = event.startTime.toDate();
      const year = moment(date).format("YYYY");
      const month = moment(date).format("MMM");

      if (!groups[year]) {
        groups[year] = {};
      }
      if (!groups[year][month]) {
        groups[year][month] = [];
      }
      groups[year][month].push(event);
    });
    return groups;
  };

  const groupedEvents = groupEventsByYearAndMonth(events);

  const numberOfYears = Object.keys(groupedEvents).length;

  const handleOnPress = (event) => {
    onPress(event);
  };

  return (
    <View>
      {Object.entries(groupedEvents).map(([year, months]) => (
        <View key={year}>
          {numberOfYears > 1 && (
            <Subtitle
              size={24}
              style={{
                color: theme.PRIMARY,
                paddingBottom: 10,
              }}
            >
              {year}
            </Subtitle>
          )}
          {Object.entries(months).map(([month, events]) => (
            <View key={month}>
              <Subtitle
                size={20}
                style={{
                  color: theme.PRIMARY,
                  paddingBottom: 10,
                }}
              >
                {month}
              </Subtitle>
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
                      {event.thumbnail && (
                        <>
                          <Animated.Image
                            source={{ uri: event.thumbnail }}
                            style={{
                              width: "100%",
                              height: "100%",
                              borderRadius: ANIMATED_BORDER_RADIUS,
                            }}
                            sharedTransitionTag={`event-${event.eventId}`}
                          />
                          <View style={styles.overlay} />
                        </>
                      )}
                      <View
                        style={{
                          position: "absolute",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Body bold={true} size={30}>
                          {moment(event.startTime.toDate()).format("Do")}
                        </Body>
                        {event.isInvited && (
                          <View
                            style={{
                              backgroundColor: `${theme.DARK}95`,
                              borderRadius: 10,
                              marginTop: 5,
                              justifyContent: "center",
                              alignItems: "center",
                              zIndex: 10,
                            }}
                          >
                            <Body size={16} style={{ padding: 5 }}>
                              Invited
                            </Body>
                          </View>
                        )}
                      </View>
                    </View>

                    <Body
                      style={styles.text}
                      adjustsFontSizeToFit
                      numberOfLines={1}
                    >
                      {event.eventName}
                    </Body>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </View>
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
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    borderRadius: 100,
  },
});

export default Calendar;
