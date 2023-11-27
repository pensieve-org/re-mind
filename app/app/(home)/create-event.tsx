import React, { useContext, useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  View,
  Image,
  Alert as RNAlert,
  ActivityIndicator,
} from "react-native";
import { View as AnimatedView } from "react-native-animatable";
import { router } from "expo-router";

import BackArrow from "../../assets/arrow-left.svg";
import theme from "../../assets/theme";
import {
  ANIMATION_DURATION,
  ANIMATION_ENTRY,
  ANIMATION_EXIT,
  HEADER_ICON_DIMENSION,
  HORIZONTAL_PADDING,
  PROFILE_ICON_DIMENSION,
} from "../../assets/constants";
import Body from "../../components/Body";
import Header from "../../components/Header";
import { AppContext } from "../_layout";
import Subtitle from "../../components/Subtitle";
import SubtitleInput from "../../components/SubtitleInput";
import DatePicker from "../../components/DatePicker";
import AddFriendsList from "../../components/AddFriendsList";
import getFriends from "../../services/get.friends";
import { ScrollView } from "react-native-gesture-handler";
import ImageIcon from "../../assets/image.svg";
import CameraIcon from "../../assets/camera.svg";
import * as ImagePicker from "expo-image-picker";
import { uploadImageAsync } from "../../utils";
import createEvent from "../../services/create.event";
import updateEventThumbnail from "../../services/update.eventThumbnail";
import getAllUserEvents from "../../services/get.allUserEvents";
import Alert from "../../components/Alert";
import Button from "../../components/Button";

export default function CreateEvent() {
  const { userDetails, setUserEvents } = useContext(AppContext);
  const [animation, setAnimation] = useState(ANIMATION_ENTRY);
  const [eventName, setEventName] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [unselectedFriends, setUnselectedFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [thumbnail, setThumbnail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigateBack = () => {
    setAnimation(ANIMATION_EXIT);
    setTimeout(() => {
      router.back();
    }, ANIMATION_DURATION);
  };

  const handleThumbnailChange = async () => {
    try {
      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 3],
        quality: 1,
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

      setThumbnail(pickerResult.assets[0].uri);
    } catch (error) {
      console.error("An error occurred:", error.response.data.detail);
    }
  };

  const handleCreateEvent = async () => {
    if (isLoading) return;

    setError(false);

    if (!startDate || !endDate || !eventName) {
      setError(true);
      setErrorMsg("Please fill out all required fields");
      return;
    }

    setIsLoading(true);

    try {
      const newEvent = await createEvent({
        start_time: startDate,
        end_time: endDate,
        name: eventName,
        attendees: [...selectedFriends, userDetails],
        admin: userDetails,
      });

      if (thumbnail) {
        try {
          console.log(thumbnail);
          const uploadUrl = await uploadImageAsync(
            thumbnail,
            `/events/${newEvent.event_id}`
          );
          console.log(uploadUrl);
          const response = await updateEventThumbnail(
            newEvent.event_id,
            uploadUrl
          );
          console.log(response);
        } catch (e) {
          console.error("Error updating event thumbnail");
        }
      }

      setUserEvents(await getAllUserEvents(userDetails.user_id));

      setIsLoading(false);

      RNAlert.alert(
        "Event Created",
        "Your event has been successfully created.",
        [{ text: "OK", onPress: navigateBack }]
      );
    } catch (error) {
      setError(true);
      setIsLoading(false);
      setErrorMsg(error.response?.data?.detail || "An error occurred");
    }
  };

  const fetchFriends = async () => {
    try {
      setUnselectedFriends(await getFriends(userDetails.user_id));
    } catch (error) {
      alert(error.response.data.detail);
    }
  };

  useEffect(() => {
    fetchFriends();
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
      />
      <AnimatedView
        animation={animation}
        duration={ANIMATION_DURATION}
        style={styles.page}
      >
        {error && (
          <View style={styles.alertContainer}>
            <Alert text={errorMsg} />
          </View>
        )}

        <View style={styles.container}>
          <View style={{ paddingVertical: 20 }}>
            <Subtitle size={25}>new event</Subtitle>
          </View>

          <ScrollView style={{ paddingBottom: 80 }}>
            <View style={styles.thumbnailContainer}>
              <View>
                <View
                  style={{
                    width: PROFILE_ICON_DIMENSION,
                    height: PROFILE_ICON_DIMENSION,
                    borderRadius: 100,
                    backgroundColor: thumbnail
                      ? "transparent"
                      : theme.PLACEHOLDER,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {thumbnail ? (
                    <Image
                      source={{ uri: thumbnail }}
                      style={{
                        width: PROFILE_ICON_DIMENSION,
                        height: PROFILE_ICON_DIMENSION,
                        borderRadius: 100,
                      }}
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

            <SubtitleInput
              size={20}
              text={"event name..."}
              onChangeText={setEventName}
            />

            <View style={{ paddingTop: 20 }}>
              <Subtitle size={20}>event duration</Subtitle>
            </View>

            <DatePicker
              selectedStartDate={setStartDate}
              selectedEndDate={setEndDate}
            />

            <Subtitle size={20} style={{ paddingBottom: 10 }}>
              attendees
            </Subtitle>
            {selectedFriends.length > 0 ? (
              <AddFriendsList
                unselectedFriends={selectedFriends}
                selectedFriends={unselectedFriends}
                setSelectedFriends={setUnselectedFriends}
                setUnselectedFriends={setSelectedFriends}
              />
            ) : (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  paddingVertical: 10,
                }}
              >
                <Body style={{ paddingBottom: 10 }}>no friends invited</Body>
              </View>
            )}

            <Subtitle size={20} style={{ paddingBottom: 10 }}>
              invite friends
            </Subtitle>
            {unselectedFriends.length > 0 ? (
              <AddFriendsList
                unselectedFriends={unselectedFriends}
                selectedFriends={selectedFriends}
                setSelectedFriends={setSelectedFriends}
                setUnselectedFriends={setUnselectedFriends}
              />
            ) : (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  paddingVertical: 10,
                }}
              >
                <Body style={{ paddingBottom: 10 }}>no friends to add</Body>
              </View>
            )}
            <View style={{ paddingVertical: 20 }}>
              <Button
                fill={theme.TEXT}
                textColor={theme.BACKGROUND}
                onPress={handleCreateEvent}
              >
                create event
              </Button>
            </View>
            <View style={{ height: 50 }}>
              {isLoading && (
                <ActivityIndicator
                  style={styles.loading}
                  size={"large"}
                  color={theme.PRIMARY}
                />
              )}
            </View>
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
  thumbnailContainer: {
    marginBottom: 30,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  alertContainer: {
    alignItems: "center",
    height: 80,
  },
  loading: {
    width: "100%",
    justifyContent: "center",
    paddingBottom: 50,
  },
});
