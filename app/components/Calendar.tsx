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
import moment from "moment";
import Subtitle from "./Subtitle";

interface Props {
  events: any[];
  onPress?: (event) => void;
}

const Calendar: React.FC<Props> = ({ events, onPress }) => {
  const groupEventsByYearAndMonth = (events) => {
    const groups = {};
    events.forEach((event) => {
      const year = moment(event.start_time).format("YYYY");
      const month = moment(event.start_time).format("MMM");

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

  const handleOnPress = (event) => {
    onPress(event);
  };

  return (
    <View>
      {Object.entries(groupedEvents).map(([year, months]) => (
        <View key={year}>
          <Subtitle
            size={24}
            style={{
              color: theme.PRIMARY,
              paddingVertical: 10,
            }}
          >
            {year}
          </Subtitle>
          {Object.entries(months).map(([month, events]) => (
            <View key={month}>
              <Subtitle
                size={20}
                style={{
                  color: theme.PRIMARY,
                  paddingVertical: 10,
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
                        },
                      ]}
                    >
                      {event.thumbnail ? (
                        <Image
                          source={{ uri: event.thumbnail }}
                          style={styles.image}
                        />
                      ) : (
                        <ImageIcon
                          height={EVENT_ICON_DIAMETER - 80}
                          width={EVENT_ICON_DIAMETER - 80}
                          style={{ color: theme.PRIMARY }}
                        />
                      )}
                    </View>
                    <Body
                      style={styles.text}
                      adjustsFontSizeToFit
                      numberOfLines={1}
                    >
                      {event.name}
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
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 100,
  },
  monthYearHeader: {
    // Add your styling for the header here
    fontWeight: "bold",
    fontSize: 18,
    padding: 10,
    textAlign: "center",
  },
});

export default Calendar;
