import React, { useContext, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { router } from "expo-router";
import { View as AnimatedView } from "react-native-animatable";

import Body from "../../components/Body";
import EventList from "../../components/EventList";
import Header from "../../components/Header";
import Subtitle from "../../components/Subtitle";

import Plus from "../../assets/plus.svg";
import theme from "../../assets/theme";

import {
  ANIMATION_DURATION,
  ANIMATION_ENTRY,
  ANIMATION_EXIT,
  HEADER_ICON_DIMENSION,
  HORIZONTAL_PADDING,
} from "../../assets/constants";

import { AppContext } from "../_layout";
import getAllUserEvents from "../../services/get.allUserEvents";
import ProfileIcon from "../../assets/profile.svg";

type EventCategory = "current" | "upcoming" | "past";

export default function Home() {
  const { userDetails, userEvents, setUserEvents, setSelectedEvent } =
    useContext(AppContext);
  const [refreshing, setRefreshing] = useState(false);
  const [animation, setAnimation] = useState(ANIMATION_ENTRY);
  const [selectedEventCategory, setSelectedEventCategory] =
    useState<EventCategory>("current");

  const navigate = (route) => {
    setAnimation(ANIMATION_EXIT);
    setTimeout(() => {
      router.push(route);
    }, ANIMATION_DURATION);
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    setUserEvents(await getAllUserEvents(userDetails.user_id));
    setRefreshing(false);
  }, []);

  const handleEventPress = async (event) => {
    setSelectedEvent(event);
    navigate("/event");
  };

  return (
    <View style={styles.page}>
      <Header
        imageLeft={
          <View
            style={{
              width: HEADER_ICON_DIMENSION,
              height: HEADER_ICON_DIMENSION,
              borderRadius: 100,
              backgroundColor: userDetails.profile_picture_url
                ? "transparent"
                : theme.PLACEHOLDER,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {userDetails.profile_picture_url ? (
              <Image
                source={{ uri: userDetails.profile_picture_url }}
                style={{
                  width: HEADER_ICON_DIMENSION,
                  height: HEADER_ICON_DIMENSION,
                  borderRadius: 100,
                }}
              />
            ) : (
              <ProfileIcon
                height={15}
                width={15}
                style={{ color: theme.PRIMARY }}
              />
            )}
          </View>
        }
        onPressLeft={() => navigate("/profile")}
        imageRight={
          <Plus
            height={HEADER_ICON_DIMENSION}
            width={HEADER_ICON_DIMENSION}
            style={{ color: theme.PRIMARY }}
          />
        }
        onPressRight={() => navigate("/create-event")}
      />
      <AnimatedView
        animation={animation}
        duration={ANIMATION_DURATION}
        style={styles.page}
      >
        <View style={styles.container}>
          <View style={{ paddingVertical: 20 }}>
            <Subtitle size={23}>memories</Subtitle>
          </View>

          <View
            style={{
              paddingBottom: 20,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Pressable onPress={() => setSelectedEventCategory("current")}>
              <Subtitle
                size={20}
                style={{
                  color:
                    selectedEventCategory === "current"
                      ? theme.PRIMARY
                      : theme.PLACEHOLDER,
                }}
              >
                current
              </Subtitle>
            </Pressable>
            <Pressable onPress={() => setSelectedEventCategory("upcoming")}>
              <Subtitle
                size={20}
                style={{
                  color:
                    selectedEventCategory === "upcoming"
                      ? theme.PRIMARY
                      : theme.PLACEHOLDER,
                }}
              >
                upcoming
              </Subtitle>
            </Pressable>
            <Pressable onPress={() => setSelectedEventCategory("past")}>
              <Subtitle
                size={20}
                style={{
                  color:
                    selectedEventCategory === "past"
                      ? theme.PRIMARY
                      : theme.PLACEHOLDER,
                }}
              >
                past
              </Subtitle>
            </Pressable>
          </View>

          <ScrollView
            style={{ flex: 1, paddingBottom: 50 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {refreshing && (
              <ActivityIndicator
                style={{ paddingBottom: 30 }}
                size={"large"}
                color={theme.PRIMARY}
              />
            )}
            {selectedEventCategory === "current" &&
              (userEvents.current.length > 0 ? (
                <EventList
                  events={userEvents.current}
                  onPress={handleEventPress}
                />
              ) : (
                <Body style={{ textAlign: "center", paddingVertical: 10 }}>
                  no current events
                </Body>
              ))}

            {selectedEventCategory === "upcoming" &&
              (userEvents.upcoming.length > 0 ? (
                <EventList
                  events={userEvents.upcoming}
                  onPress={handleEventPress}
                />
              ) : (
                <Body style={{ textAlign: "center", paddingVertical: 10 }}>
                  no upcoming events
                </Body>
              ))}

            {selectedEventCategory === "past" &&
              (userEvents.past.length > 0 ? (
                <EventList
                  events={userEvents.past}
                  onPress={handleEventPress}
                />
              ) : (
                <Body style={{ textAlign: "center", paddingVertical: 10 }}>
                  no past events
                </Body>
              ))}
          </ScrollView>
        </View>
      </AnimatedView>
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
});
