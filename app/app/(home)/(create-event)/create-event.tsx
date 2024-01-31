import React, { useContext, useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  View,
  Image,
  Alert as RNAlert,
  ActivityIndicator,
  Modal,
} from "react-native";
import { View as AnimatedView } from "react-native-animatable";
import { router, Link } from "expo-router";

import BackArrow from "../../../assets/arrow-left.svg";
import theme from "../../../assets/theme";
import {
  ANIMATION_DURATION,
  ANIMATION_ENTRY,
  ANIMATION_EXIT,
  HEADER_ICON_DIMENSION,
  HORIZONTAL_PADDING,
  PROFILE_ICON_DIMENSION,
} from "../../../assets/constants";
import Body from "../../../components/Body";
import Header from "../../../components/Header";
import { AppContext } from "../../_layout";
import Subtitle from "../../../components/Subtitle";
import SubtitleInput from "../../../components/SubtitleInput";
import DatePicker from "../../../components/DatePicker";
import AddFriendsList from "../../../components/AddFriendsList";
import createEvent from "../../../apis/createEvent";
import getUserEvents from "../../../apis/getUserEvents";
import Alert from "../../../components/Alert";
import Button from "../../../components/Button";
import getFriendDetails from "../../../apis/getFriendDetails";
import GradientScrollView from "../../../components/GradientScrollView";
import LocationSelector from "../../../components/LocationSelector";
import LocationDot from "../../../assets/location-dot.svg";

export default function CreateEvent() {
  const { userDetails, setUserEvents } = useContext(AppContext);
  const [animation, setAnimation] = useState(ANIMATION_ENTRY);
  const [eventName, setEventName] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [unselectedFriends, setUnselectedFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigateBack = () => {
    setAnimation(ANIMATION_EXIT);
    setTimeout(() => {
      router.back();
    }, ANIMATION_DURATION);
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
    const now = new Date();

    let status, uploadFlag;
    uploadFlag = false;
    if (now < startDate) {
      status = "future";
    } else if (now > endDate) {
      status = "past";
    } else {
      status = "live";
      uploadFlag = true;
    }

    try {
      // TODO: Add description and location
      await createEvent(
        {
          startTime: startDate,
          endTime: endDate,
          eventName: eventName,
          status: status,
          thumbnail: null,
          uploadFlag: uploadFlag,
        },
        selectedFriends,
        userDetails
      );

      // TODO: remove this eventually, when the auto listener works
      setUserEvents(await getUserEvents(userDetails.userId));

      setIsLoading(false);
    } catch (error) {
      setError(true);
      setIsLoading(false);
      setErrorMsg(error.message || "An error occurred");
    }
  };

  const fetchFriends = async () => {
    try {
      setUnselectedFriends(await getFriendDetails(userDetails.userId));
    } catch (error) {
      alert(error.message);
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
          <View style={{ paddingTop: 20 }}>
            <Subtitle size={25}>new event</Subtitle>
          </View>

          <GradientScrollView
            contentContainerStyle={{ paddingBottom: 80 }}
            showsVerticalScrollIndicator={false}
          >
            <SubtitleInput
              size={20}
              text={"event name..."}
              onChangeText={setEventName}
            />

            <Link href="/location-modal">
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingTop: 20,
                }}
              >
                <LocationDot
                  height={20}
                  width={20}
                  style={{ color: theme.PRIMARY }}
                />
                <Subtitle size={20} style={{ paddingLeft: 10 }}>
                  location
                </Subtitle>
              </View>
            </Link>

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
          </GradientScrollView>
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
