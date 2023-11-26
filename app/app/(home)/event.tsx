import React, { useContext, useState } from "react";
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
        <ScrollView
          style={styles.container}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {refreshing && (
            <ActivityIndicator
              style={{ padding: 10 }}
              size={"large"}
              color={theme.PRIMARY}
            />
          )}
          <View style={{ paddingVertical: 20 }}>
            <Body>Event id: {selectedEvent.event_id}</Body>
            <Body>Start Time: {selectedEvent.start_time}</Body>
            <Body>End Time: {selectedEvent.end_time}</Body>
          </View>
          <View style={styles.imageContainer}>
            {selectedEvent.images.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image.url }}
                style={[
                  styles.image,
                  {
                    marginRight: (index + 1) % ROW_IMAGES === 0 ? 0 : IMAGE_GAP,
                  },
                ]}
              />
            ))}
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
    justifyContent: "flex-start",
  },
  image: {
    width: EVENT_IMAGE_WIDTH,
    height: EVENT_IMAGE_WIDTH,
    marginBottom: IMAGE_GAP,
  },
});
