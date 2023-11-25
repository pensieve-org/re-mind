import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
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

export default function CreateEvent() {
  const { userDetails } = useContext(AppContext);
  const [animation, setAnimation] = useState(ANIMATION_ENTRY);
  const [eventName, setEventName] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [unselectedFriends, setUnselectedFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);

  const navigateBack = () => {
    setAnimation(ANIMATION_EXIT);
    setTimeout(() => {
      router.back();
    }, ANIMATION_DURATION);
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
        <View style={styles.container}>
          <View style={{ paddingVertical: 20 }}>
            <Subtitle size={25}>new event</Subtitle>
          </View>

          <ScrollView>
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
