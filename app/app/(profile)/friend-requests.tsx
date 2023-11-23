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
import sendFriendRequest from "../../services/send.friendRequest";
import acceptFriendRequest from "../../services/accept.friendRequest";
import getFriendRequests from "../../services/get.friendRequests";
import AddFriend from "../../components/AddFriend";
import rejectFriendRequest from "../../services/reject.friendRequest";
import FloatingActionBar from "../../components/FloatingActionBar";
import FriendRequestList from "../../components/FriendRequestList";

// TODO: add bottom nav and have 3 tabs, profile, add friends and my friends
// TODO: add a notification bell in the header on the right to accept friend reqs
export default function MyFriends() {
  const { userDetails } = useContext(AppContext);
  const [animation, setAnimation] = useState(ANIMATION_ENTRY);
  const [friendRequests, setFriendRequests] = useState([]);
  const [friendUsername, setFriendUsername] = useState("");

  const navigate = (route) => {
    setAnimation(ANIMATION_EXIT);
    setTimeout(() => {
      router.replace(route);
    }, ANIMATION_DURATION);
  };

  const navigateBack = () => {
    setAnimation(ANIMATION_EXIT);
    setTimeout(() => {
      router.back();
    }, ANIMATION_DURATION);
  };

  // TODO: remove alerts and do better error display
  const handleSendFriendRequest = async () => {
    if (!friendUsername) return;
    try {
      await sendFriendRequest(userDetails.user_id, friendUsername);
      alert("Friend request sent!");
    } catch (error) {
      alert(error.response.data.detail);
    }
  };

  const handleAcceptFriend = async (friend) => {
    try {
      await acceptFriendRequest(userDetails.user_id, friend.user_id);
      fetchFriendRequests();
    } catch (error) {
      alert(error.response.data.detail);
    }
  };

  const handleRejectFriend = async (friend) => {
    try {
      await rejectFriendRequest(userDetails.user_id, friend.user_id);
      fetchFriendRequests();
    } catch (error) {
      alert(error.response.data.detail);
    }
  };

  const fetchFriendRequests = async () => {
    try {
      setFriendRequests(await getFriendRequests(userDetails.user_id));
    } catch (error) {
      alert(error.response.data.detail);
    }
  };

  useEffect(() => {
    fetchFriendRequests();
    console.log(friendRequests);
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
          {/* TODO: update this to show the 5 most similar names in the database. 
          Allow user to select by choosing from list */}
          <View style={{ paddingVertical: 10, paddingBottom: 20 }}>
            <AddFriend
              placeholder="friend's username"
              label="add friends"
              value={friendUsername}
              onChangeText={setFriendUsername}
              onPress={handleSendFriendRequest}
            />
          </View>

          <View style={{ flex: 1 }}>
            <View style={{ paddingBottom: 10 }}>
              <Body size={14}>FRIEND REQUESTS ({friendRequests.length})</Body>
            </View>
            <FriendRequestList
              friendRequests={friendRequests}
              onPressTick={handleAcceptFriend}
              onPressCross={handleRejectFriend}
            />
          </View>
        </View>
      </AnimatedView>
      <View
        style={{
          position: "absolute",
          bottom: 30,
          left: 0,
          right: 0,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <FloatingActionBar
          items={["Friends", "Requests"]}
          selectedItem="Requests"
          onPressItem={(item) => {
            if (item === "Friends") {
              navigate("/my-friends");
            }
          }}
        />
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
