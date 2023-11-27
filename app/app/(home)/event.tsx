import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { View as AnimatedView } from "react-native-animatable";
import { router } from "expo-router";

import BackArrow from "../../assets/arrow-left.svg";
import ThreeDots from "../../assets/three-dots.svg";
import {
  ANIMATION_DURATION,
  ANIMATION_ENTRY,
  ANIMATION_EXIT,
  EVENT_IMAGE_WIDTH,
  HEADER_ICON_DIMENSION,
  HORIZONTAL_PADDING,
  IMAGE_GAP,
  ROW_IMAGES,
} from "../../assets/constants";
import theme from "../../assets/theme";
import Body from "../../components/Body";
import Header from "../../components/Header";
import getEvent from "../../services/get.event";
import { AppContext } from "../_layout";
import Subtitle from "../../components/Subtitle";
import ShowAttendees from "../../components/ShowAttendees";

export default function Event() {
  const { userDetails, selectedEvent, setSelectedEvent } =
    useContext(AppContext);
  const [refreshing, setRefreshing] = useState(false);
  const [animation, setAnimation] = useState(ANIMATION_ENTRY);

  const isAdmin = selectedEvent.admins.some(
    (admin) => admin.user_id === userDetails.user_id
  );

  const navigateBack = () => {
    setAnimation(ANIMATION_EXIT);
    setTimeout(() => {
      router.back();
    }, ANIMATION_DURATION);
  };

  const navigate = (route) => {
    setAnimation(ANIMATION_EXIT);
    setTimeout(() => {
      router.push(route);
    }, ANIMATION_DURATION);
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    setSelectedEvent(await getEvent(selectedEvent.event_id));
    setRefreshing(false);
  }, []);

  const formatDate = (date: Date | null) => {
    return date
      ? date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        })
      : "";
  };

  const formatTime = (date: Date | null) => {
    return date
      ? date.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      : "";
  };

  return (
    <View style={styles.page}>
      <Header
        imageLeft={
          <BackArrow
            height={HEADER_ICON_DIMENSION}
            width={HEADER_ICON_DIMENSION}
            style={{ color: theme.PRIMARY }}
          />
        }
        onPressLeft={navigateBack}
        imageRight={
          isAdmin && (
            <ThreeDots
              height={HEADER_ICON_DIMENSION}
              width={HEADER_ICON_DIMENSION}
              style={{ color: theme.PRIMARY }}
            />
          )
        }
        onPressRight={() => {
          if (isAdmin) {
            navigate("/edit-event");
          }
        }}
      />
      <AnimatedView
        animation={animation}
        duration={ANIMATION_DURATION}
        style={styles.page}
      >
        {refreshing && (
          <ActivityIndicator
            style={{ padding: 10 }}
            size={"large"}
            color={theme.PRIMARY}
          />
        )}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 80 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.container}>
            <Subtitle
              size={23}
              style={{
                color: theme.PRIMARY,
                paddingVertical: 10,
              }}
            >
              {selectedEvent.name}
            </Subtitle>

            {/* TODO: Replace this with a timeline with length = event duration and split into 
            mins if event < 1hr, hours if event < 1 day, otherwise days
            have a line graph for umber of photos uploaded in each segment */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                paddingVertical: 10,
              }}
            >
              <View style={{ alignItems: "center" }}>
                <Body size={18}>
                  {formatDate(new Date(selectedEvent.start_time))}
                </Body>
                <Body size={18}>
                  {formatTime(new Date(selectedEvent.start_time))}
                </Body>
              </View>

              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <BackArrow
                  height={20}
                  width={20}
                  style={{
                    color: theme.PRIMARY,
                    transform: [{ rotate: "180deg" }],
                  }}
                />
              </View>

              <View style={{ alignItems: "center" }}>
                <Body size={18}>
                  {formatDate(new Date(selectedEvent.end_time))}
                </Body>
                <Body size={18}>
                  {formatTime(new Date(selectedEvent.end_time))}
                </Body>
              </View>
            </View>

            <Subtitle
              size={20}
              style={{
                color: theme.PRIMARY,
                paddingVertical: 10,
              }}
            >
              shared with
            </Subtitle>
            <ShowAttendees attendees={selectedEvent.attendees} />
          </View>

          <View style={styles.imageContainer}>
            {selectedEvent.images.length > 0 ? (
              selectedEvent.images.map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: image.url }}
                  style={[
                    styles.image,
                    {
                      marginRight:
                        (index + 1) % ROW_IMAGES === 0 ? 0 : IMAGE_GAP,
                    },
                  ]}
                />
              ))
            ) : (
              <View style={{ paddingVertical: 20, justifyContent: "center" }}>
                <Body>No images yet</Body>
              </View>
            )}
          </View>
        </ScrollView>
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
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  image: {
    width: EVENT_IMAGE_WIDTH,
    height: EVENT_IMAGE_WIDTH,
    marginBottom: IMAGE_GAP,
  },
});
