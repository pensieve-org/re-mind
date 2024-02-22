import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  View,
  Image,
  Pressable,
  Modal,
} from "react-native";
import { router } from "expo-router";
import {
  HORIZONTAL_PADDING,
  PROFILE_ICON_DIMENSION,
} from "../../../assets/constants";
import theme from "../../../assets/theme";
import { AppContext } from "../../_layout";
import Subtitle from "../../../components/Subtitle";
import Button from "../../../components/Button";
import deleteEvent from "../../../apis/deleteEvent";
import getEventAdmins from "../../../apis/getEventAdmins";
import leaveEvent from "../../../apis/leaveEvent";
import ImageIcon from "../../../assets/image.svg";
import CameraIcon from "../../../assets/camera.svg";
import * as ImagePicker from "expo-image-picker";
import uploadImageAsync from "../../../utils/uploadImageAsync";
import updateThumbnail from "../../../apis/updateThumbnail";
import Animated from "react-native-reanimated";

export default function EventSettings() {
  const {
    userDetails,
    selectedEvent,
    setSelectedEvent,
    setUserEvents,
    userEvents,
  } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isThumbnailLoading, setIsThumbnailLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(null);

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

  const handleThumbnailChange = async () => {
    try {
      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 3],
        quality: 0,
      });

      if (pickerResult.canceled) {
        console.log("User cancelled image picker");
        return null;
      }

      if (!pickerResult.assets[0].uri) {
        console.log("No URI found");
        return null;
      }

      console.log(pickerResult.assets[0].uri);

      setIsThumbnailLoading(true);

      const uploadUrl = await uploadImageAsync(
        pickerResult.assets[0].uri,
        `/events/${selectedEvent.eventId}/thumbnail`
      );

      console.log(uploadUrl);

      await updateThumbnail(selectedEvent.eventId, uploadUrl);

      setSelectedEvent({ ...selectedEvent, thumbnail: uploadUrl });

      setIsThumbnailLoading(false);
    } catch (error) {
      console.error("An error occurred:", error.message);
    }
  };

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
              setUserEvents((prevUserEvents) =>
                prevUserEvents.filter(
                  (event) => event.eventId !== selectedEvent.eventId
                )
              );
              router.replace("/home");
              setIsLoading(false);
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
              setUserEvents((prevUserEvents) =>
                prevUserEvents.filter(
                  (event) => event.eventId !== selectedEvent.eventId
                )
              );
              router.replace("/home");
              setIsLoading(false);
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
      <View style={styles.container}>
        <View style={{ paddingVertical: 20 }}>
          <Subtitle size={25}>settings</Subtitle>
        </View>

        <View style={styles.thumbnailContainer}>
          <View>
            <View
              style={{
                width: PROFILE_ICON_DIMENSION,
                height: PROFILE_ICON_DIMENSION,
                borderRadius: 100,
                backgroundColor: selectedEvent.thumbnail
                  ? "transparent"
                  : theme.PLACEHOLDER,
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              {isThumbnailLoading ? (
                <ActivityIndicator size={"large"} color={theme.PRIMARY} />
              ) : selectedEvent.thumbnail ? (
                <Animated.Image
                  source={{ uri: selectedEvent.thumbnail }}
                  style={{
                    width: PROFILE_ICON_DIMENSION,
                    height: PROFILE_ICON_DIMENSION,
                    borderRadius: 0,
                  }}
                  sharedTransitionTag={`event-${selectedEvent.eventId}`}
                />
              ) : (
                <ImageIcon
                  height={70}
                  width={70}
                  style={{ color: theme.PRIMARY }}
                />
              )}
            </View>

            <Pressable
              onPress={handleThumbnailChange}
              style={({ pressed }) => [
                {
                  position: "absolute",
                  right: 0,
                  bottom: 0,
                  borderRadius: 100,
                  backgroundColor: theme.PRIMARY,
                  alignItems: "center",
                  justifyContent: "center",
                  height: 40,
                  width: 40,
                  transform: [{ scale: pressed ? 0.9 : 1 }],
                },
              ]}
            >
              <CameraIcon
                height={20}
                width={20}
                style={{ color: theme.BACKGROUND }}
              />
            </Pressable>
          </View>
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

      <Modal animationType="fade" transparent={true} visible={isLoading}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
          }}
        >
          <ActivityIndicator size={"large"} color={theme.PRIMARY} />
        </View>
      </Modal>
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
  thumbnailContainer: {
    marginBottom: 30,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
});
