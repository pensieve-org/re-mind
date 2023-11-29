import React, { useContext, useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
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
import FriendList from "../../components/FriendList";
import Header from "../../components/Header";
import { AppContext } from "../_layout";
import sendFriendRequest from "../../services/sendFriendRequest";
import getUserDetails from "../../services/getUserDetails";
import removeFriend from "../../services/removeFriend";
import AddFriend from "../../components/AddFriendInput";
import FloatingActionBar from "../../components/FloatingActionBar";
import FriendRequestList from "../../components/FriendRequestList";
import acceptFriendRequest from "../../services/acceptFriendRequest";
import getFriendRequests from "../../services/getFriendRequests";

export default function MyFriends() {
  const { userDetails } = useContext(AppContext);
  const [animation, setAnimation] = useState(ANIMATION_ENTRY);
  const [friends, setFriends] = useState([]);
  const [friendUsername, setFriendUsername] = useState("");
  const [selectedItem, setSelectedItem] = useState("Friends");
  const [friendRequests, setFriendRequests] = useState([]);

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

  const handleRemoveFriend = async (friend) => {
    try {
      Alert.alert(
        "Confirmation",
        `Are you sure you want to remove '${friend.username}' as a friend?`,
        [
          { text: "No" },
          {
            text: "Yes",
            onPress: async () => {
              await removeFriend(userDetails.user_id, friend.user_id);
              await fetchFriends();
            },
          },
        ]
      );
    } catch (error) {
      alert(error.response.data.detail);
    }
  };
  const handleAcceptFriend = async (friend) => {
    try {
      await acceptFriendRequest(userDetails.user_id, friend.user_id);
      await fetchFriendRequests();
      await fetchFriends();
    } catch (error) {
      alert(error.response.data.detail);
    }
  };

  const handleRejectFriend = async (friend) => {
    try {
      await rejectFriendRequest(userDetails.user_id, friend.user_id);
      await fetchFriendRequests();
      await fetchFriends();
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

  const fetchFriends = async () => {
    try {
      setFriends(await getUserDetails(userDetails.user_id));
    } catch (error) {
      alert(error.response.data.detail);
    }
  };

  useEffect(() => {
    fetchFriends();
    fetchFriendRequests();
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

          {selectedItem === "Friends" ? (
            <View style={{ flex: 1 }}>
              <View style={{ paddingBottom: 10 }}>
                <Body size={14}>MY FRIENDS ({friends.length})</Body>
              </View>
              <FriendList friends={friends} onPress={handleRemoveFriend} />
            </View>
          ) : (
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
          )}
        </View>
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
            initialSelectedItem={selectedItem}
            friendRequests={friendRequests.length}
            onPressItem={(item) => {
              fetchFriends();
              fetchFriendRequests();
              setSelectedItem(item);
            }}
          />
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
