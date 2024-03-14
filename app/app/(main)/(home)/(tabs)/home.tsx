import React, { useContext, useState, useEffect, useRef, useMemo } from "react";
import {
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";
import { router, Stack } from "expo-router";
import {
  View as AnimatedView,
  initializeRegistryWithDefinitions,
} from "react-native-animatable";
import Body from "../../../../components/Body";
import EventList from "../../../../components/EventList";
import Subtitle from "../../../../components/Subtitle";
import Plus from "../../../../assets/plus.svg";
import theme from "../../../../assets/theme";
import {
  HEADER_ICON_DIMENSION,
  HEADER_MARGIN,
  HORIZONTAL_PADDING,
  ANIMATED_BORDER_RADIUS,
} from "../../../../assets/constants";
import { AppContext } from "../../../_layout";
import getUserEvents from "../../../../apis/getUserEvents";
import ProfileIcon from "../../../../assets/profile.svg";
import Calendar from "../../../../components/Calendar";
import GradientScrollView from "../../../../components/GradientScrollView";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { db } from "../../../../firebase.js";
import { AnimatedImage } from "../../../../utils/AnimatedImage";
import Header from "../../../../components/Header";

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
  const {
    userDetails,
    userEvents,
    setUserEvents,
    setSelectedEvent,
    homeTabState,
    setHomeTabState,
  } = useContext(AppContext);
  const [refreshing, setRefreshing] = useState(false);
  const isMounted = useRef(true);

  const handleEventPress = (event) => {
    setSelectedEvent(event);
    router.push("/event");
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    setUserEvents(await getUserEvents(userDetails.userId));
    setRefreshing(false);
  }, [userDetails.userId]);

  const memoriesComponent = useMemo(() => {
    return (
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
          {userEvents.filter((event) => event.status === "live").length > 0 && (
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

        {userEvents.filter((event) => event.status === "live").length > 0 ? (
          <EventList
            events={userEvents.filter((event) => event.status === "live")}
            onPress={handleEventPress}
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

        {userEvents.filter((event) => event.status === "past").length > 0 ? (
          <EventList
            events={userEvents.filter((event) => event.status === "past")}
            onPress={handleEventPress}
          />
        ) : (
          <Body style={{ textAlign: "center", paddingVertical: 10 }}>
            no past events
          </Body>
        )}
      </>
    );
  }, [userEvents, handleEventPress]); // Dependencies array

  const calendarComponent = useMemo(() => {
    return (
      <>
        {userEvents.filter((event) => event.status === "future").length > 0 ? (
          <Calendar
            events={userEvents.filter((event) => event.status === "future")}
            onPress={handleEventPress}
          />
        ) : (
          <Body style={{ textAlign: "center", paddingVertical: 10 }}>
            no upcoming events
          </Body>
        )}
      </>
    );
  }, [userEvents, handleEventPress]); // Dependencies array

  return (
    <View style={styles.page}>
      <Stack.Screen
        options={{
          header: () => (
            <Header
              onPressLeft={() => router.push("/profile")}
              onPressRight={() => router.push("/create-event")}
              imageLeft={
                userDetails.profilePicture ? (
                  <AnimatedImage
                    source={{ uri: userDetails.profilePicture }}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: ANIMATED_BORDER_RADIUS,
                    }}
                    sharedTransitionTag="profile-picture"
                    cachePolicy={"memory-disk"}
                    priority={"high"}
                  />
                ) : (
                  <ProfileIcon
                    height={"50%"}
                    width={"50%"}
                    style={{ color: theme.PRIMARY }}
                  />
                )
              }
              imageRight={
                <Plus
                  height={"100%"}
                  width={"100%"}
                  style={{ color: theme.PRIMARY }}
                />
              }
            />
          ),
        }}
      />

      <View style={styles.container}>
        <View
          style={{
            paddingTop: 10,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Pressable onPress={() => setHomeTabState("memories")}>
            <Subtitle
              size={25}
              style={{
                color:
                  homeTabState === "memories"
                    ? theme.PRIMARY
                    : theme.PLACEHOLDER,
              }}
            >
              memories
            </Subtitle>
            {userEvents.filter(
              (event) =>
                event.isInvited &&
                (event.status === "live" || event.status === "past")
            ).length > 0 && (
              <View
                style={{
                  position: "absolute",
                  right: -20,
                  top: -5,
                  backgroundColor: theme.RED,
                  borderRadius: 100,
                  height: 20,
                  width: 20,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Body
                  adjustsFontSizeToFit={true}
                  bold={true}
                  style={{ color: theme.PRIMARY }}
                >
                  {
                    userEvents.filter(
                      (event) =>
                        event.isInvited &&
                        (event.status === "live" || event.status === "past")
                    ).length
                  }
                </Body>
              </View>
            )}
          </Pressable>

          <Pressable onPress={() => setHomeTabState("calendar")}>
            <Subtitle
              size={25}
              style={{
                color:
                  homeTabState === "calendar"
                    ? theme.PRIMARY
                    : theme.PLACEHOLDER,
              }}
            >
              calendar
            </Subtitle>
            {userEvents.filter(
              (event) => event.isInvited && event.status === "future"
            ).length > 0 && (
              <View
                style={{
                  position: "absolute",
                  right: -20,
                  top: -5,
                  backgroundColor: theme.RED,
                  borderRadius: 100,
                  height: 20,
                  width: 20,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Body
                  adjustsFontSizeToFit={true}
                  bold={true}
                  style={{ color: theme.PRIMARY }}
                >
                  {
                    userEvents.filter(
                      (event) => event.isInvited && event.status === "future"
                    ).length
                  }
                </Body>
              </View>
            )}
          </Pressable>
        </View>

        <GradientScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {homeTabState === "memories" ? memoriesComponent : calendarComponent}
        </GradientScrollView>
      </View>
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
