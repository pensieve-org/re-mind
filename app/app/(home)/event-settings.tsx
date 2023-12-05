import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";
import { View as AnimatedView } from "react-native-animatable";
import { router } from "expo-router";

import BackArrow from "../../assets/arrow-left.svg";
import {
  ANIMATION_DURATION,
  ANIMATION_ENTRY,
  ANIMATION_EXIT,
  HEADER_ICON_DIMENSION,
  HORIZONTAL_PADDING,
} from "../../assets/constants";
import theme from "../../assets/theme";
import Header from "../../components/Header";
import { AppContext } from "../_layout";
import Subtitle from "../../components/Subtitle";
import Button from "../../components/Button";
import deleteEvent from "../../services/deleteEvent";
import getEventAdmins from "../../services/getEventAdmins";
import leaveEvent from "../../services/leaveEvent";

export default function EventSettings() {
  const { userDetails, selectedEvent, setUserEvents, userEvents } =
    useContext(AppContext);
  const [animation, setAnimation] = useState(ANIMATION_ENTRY);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(null);

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

  useEffect(() => {
    const checkAdminStatus = async () => {
      const admins = await getEventAdmins(selectedEvent.eventId);
      const adminStatus = admins.some(
        (admin) => admin.userId === userDetails.userId
      );
      setIsAdmin(adminStatus);
    };

    checkAdminStatus();
  }, [selectedEvent, userDetails]);

  const handleDeleteEvent = async () => {
    Alert.alert(
      "Confirmation",
      `Are you sure you want to delete '${selectedEvent.eventName}'?`,
      [
        { text: "No" },
        {
          text: "Yes",
          onPress: async () => {
            setIsLoading(true);
            try {
              await deleteEvent(selectedEvent.eventId);
              setUserEvents((prevUserEvents) => ({
                ...prevUserEvents,
                [selectedEvent.status]: prevUserEvents[
                  selectedEvent.status
                ].filter((event) => event.eventId !== selectedEvent.eventId),
              }));
              setIsLoading(false);
              navigateHome();
            } catch (error) {
              setIsLoading(false);
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

  const handleLeaveEvent = async () => {
    Alert.alert(
      "Confirmation",
      `Are you sure you want to leave '${selectedEvent.eventName}'?`,
      [
        { text: "No" },
        {
          text: "Yes",
          onPress: async () => {
            setIsLoading(true);
            try {
              await leaveEvent(selectedEvent.eventId, userDetails.userId);
              setUserEvents((prevUserEvents) => ({
                ...prevUserEvents,
                [selectedEvent.status]: prevUserEvents[
                  selectedEvent.status
                ].filter((event) => event.eventId !== selectedEvent.eventId),
              }));
              setIsLoading(false);
              navigateHome();
            } catch (error) {
              setIsLoading(false);
              console.error(error);
              Alert.alert(
                "Error",
                "An error occurred while leaving the event."
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
        {isLoading && (
          <ActivityIndicator
            style={styles.loading}
            size={"large"}
            color={theme.PRIMARY}
          />
        )}
        <View style={styles.container}>
          <View style={{ paddingVertical: 20 }}>
            <Subtitle size={25}>settings</Subtitle>
          </View>

          {isAdmin && (
            <Button
              fill={theme.TEXT}
              textColor={theme.BACKGROUND}
              onPress={handleDeleteEvent}
            >
              delete event
            </Button>
          )}

          <Button
            fill={theme.TEXT}
            textColor={theme.BACKGROUND}
            onPress={handleLeaveEvent}
          >
            leave event
          </Button>
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
  loading: {
    width: "100%",
    justifyContent: "center",
    paddingVertical: 30,
  },
});
