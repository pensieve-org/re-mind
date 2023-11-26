import React, { useContext, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
import Button from "../../components/Button";
import deleteEvent from "../../services/delete.event";
import getAllUserEvents from "../../services/get.allUserEvents";

export default function Event() {
  const { userDetails, selectedEvent, setUserEvents } = useContext(AppContext);
  const [animation, setAnimation] = useState(ANIMATION_ENTRY);

  const navigateBack = () => {
    setAnimation(ANIMATION_EXIT);
    setTimeout(() => {
      router.back();
    }, ANIMATION_DURATION);
  };

  const navigateHome = () => {
    setAnimation(ANIMATION_EXIT);
    setTimeout(() => {
      router.replace("/home");
    }, ANIMATION_DURATION);
  };

  const handleDeleteEvent = async () => {
    Alert.alert(
      "Confirmation",
      `Are you sure you want to delete '${selectedEvent.name}'?`,
      [
        { text: "No" },
        {
          text: "Yes",
          onPress: async () => {
            try {
              await deleteEvent(selectedEvent.event_id);
              setUserEvents(await getAllUserEvents(userDetails.user_id));
              navigateHome();
            } catch (error) {
              console.error(error);
              Alert.alert(
                "Error",
                "An error occurred while deleting the event."
              );
            }
          },
        },
      ]
    );
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
      />
      <AnimatedView
        animation={animation}
        duration={ANIMATION_DURATION}
        style={styles.page}
      >
        <View style={{ paddingVertical: 20 }}>
          <Subtitle size={25}>edit event</Subtitle>
        </View>

        <Button
          fill={theme.TEXT}
          textColor={theme.BACKGROUND}
          onPress={handleDeleteEvent}
        >
          delete event
        </Button>
      </AnimatedView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: theme.BACKGROUND,
    flex: 1,
  },
});
