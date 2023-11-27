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
import {
  View as AnimatedView,
  initializeRegistryWithDefinitions,
} from "react-native-animatable";

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
import Calendar from "../../components/Calendar";

type Tab = "memories" | "calendar";
type EventRoutes = "live" | "past" | "future";

const blinkAnimation = {
  0: { opacity: 1 },
  0.8: { opacity: 1 },
  0.81: { opacity: 0 },
  1.2: { opacity: 0 },
  1.21: { opacity: 1 },
  2: { opacity: 1 },
};

initializeRegistryWithDefinitions({
  blinkAnimation,
});

export default function Home() {
  const { userDetails, userEvents, setUserEvents, setSelectedEvent } =
    useContext(AppContext);
  const [refreshing, setRefreshing] = useState(false);
  const [animation, setAnimation] = useState(ANIMATION_ENTRY);
  const [selectedTab, setSelectedTab] = useState<Tab>("memories");

  const navigate = (route) => {
    setAnimation(ANIMATION_EXIT);
    setTimeout(() => {
      router.push(route);
    }, ANIMATION_DURATION);
  };

  const navigateEvents = (route: EventRoutes) => {
    setAnimation(ANIMATION_EXIT);
    setTimeout(() => {
      router.push(`/${route}`);
    }, ANIMATION_DURATION);
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    setUserEvents(await getAllUserEvents(userDetails.user_id));
    setRefreshing(false);
  }, []);

  const handleLiveEventPress = async (event) => {
    setSelectedEvent(event);
    navigateEvents("live");
  };
  const handlePastEventPress = async (event) => {
    setSelectedEvent(event);
    navigateEvents("past");
  };
  const handleFutureEventPress = async (event) => {
    setSelectedEvent(event);
    navigateEvents("future");
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
          <View
            style={{
              paddingVertical: 20,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Pressable onPress={() => setSelectedTab("memories")}>
              <Subtitle
                size={25}
                style={{
                  color:
                    selectedTab === "memories"
                      ? theme.PRIMARY
                      : theme.PLACEHOLDER,
                }}
              >
                memories
              </Subtitle>
            </Pressable>

            <Pressable onPress={() => setSelectedTab("calendar")}>
              <Subtitle
                size={25}
                style={{
                  color:
                    selectedTab === "calendar"
                      ? theme.PRIMARY
                      : theme.PLACEHOLDER,
                }}
              >
                calendar
              </Subtitle>
            </Pressable>
          </View>
          {refreshing && (
            <ActivityIndicator
              style={{ paddingTop: 10 }}
              size={"large"}
              color={theme.PRIMARY}
            />
          )}

          <ScrollView
            style={{ flex: 1, paddingBottom: 50 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {selectedTab === "memories" ? (
              <>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Subtitle
                    size={20}
                    style={{
                      color: theme.PRIMARY,
                      paddingBottom: 10,
                    }}
                  >
                    live
                  </Subtitle>
                  {userEvents.live.length > 0 && (
                    <AnimatedView
                      animation="blinkAnimation"
                      iterationCount="infinite"
                      duration={2000}
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 100,
                        backgroundColor: theme.RED,
                        marginLeft: 5,
                        marginBottom: 25,
                      }}
                    />
                  )}
                </View>

                {userEvents.live.length > 0 ? (
                  <EventList
                    events={userEvents.live}
                    onPress={handleLiveEventPress}
                  />
                ) : (
                  <Body style={{ textAlign: "center", paddingVertical: 10 }}>
                    no live events
                  </Body>
                )}

                <Subtitle
                  size={20}
                  style={{
                    color: theme.PRIMARY,
                    paddingVertical: 10,
                  }}
                >
                  past
                </Subtitle>

                {userEvents.past.length > 0 ? (
                  <EventList
                    events={userEvents.past}
                    onPress={handlePastEventPress}
                  />
                ) : (
                  <Body style={{ textAlign: "center", paddingVertical: 10 }}>
                    no past events
                  </Body>
                )}
              </>
            ) : (
              <>
                {userEvents.future.length > 0 ? (
                  <Calendar
                    events={userEvents.future}
                    onPress={handleFutureEventPress}
                  />
                ) : (
                  <Body style={{ textAlign: "center", paddingVertical: 10 }}>
                    no upcoming events
                  </Body>
                )}
              </>
            )}
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
