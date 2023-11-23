import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  View,
  Image,
  Pressable,
  Modal,
  TouchableOpacity,
} from "react-native";
import { View as AnimatedView } from "react-native-animatable";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signOut } from "firebase/auth";

import BackArrow from "../../assets/arrow-left.svg";
import theme from "../../assets/theme";
import {
  ANIMATION_DURATION,
  ANIMATION_ENTRY,
  ANIMATION_EXIT,
  HEADER_ICON_DIMENSION,
  HORIZONTAL_PADDING,
} from "../../assets/constants";
import auth from "../../firebase.js";
import Body from "../../components/Body";
import Button from "../../components/Button";
import FriendList from "../../components/FriendList";
import Header from "../../components/Header";
import { AppContext } from "../_layout";
import sendFriendRequest from "../../services/send.friendRequest";
import acceptFriendRequest from "../../services/accept.friendRequest";
import getFriendRequests from "../../services/get.friendRequests";
import getFriends from "../../services/get.friends";
import removeFriend from "../../services/remove.friend";
import AddFriend from "../../components/AddFriend";
import NotificationBell from "../../assets/bell.svg";
import ProfileIcon from "../../assets/profile.svg";
import CameraIcon from "../../assets/camera.svg";
import * as ImagePicker from "expo-image-picker";
import updateProfilePicture from "../../services/update.profilePicture";
import { uploadImageAsync } from "../../utils";
import FriendRequestList from "../../components/FriendRequestList";
import rejectFriendRequest from "../../services/reject.friendRequest";

// TODO: add bottom nav and have 3 tabs, profile, add friends and my friends
// TODO: add a notification bell in the header on the right to accept friend reqs
export default function Profile() {
  const { userDetails, setUserDetails, setSelectedEvent, setUserEvents } =
    useContext(AppContext);
  const [animation, setAnimation] = useState(ANIMATION_ENTRY);
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [friendUsername, setFriendUsername] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const insets = useSafeAreaInsets();

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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.clear();
      setUserDetails({});
      setSelectedEvent({ images: {}, id: "" });
      setUserEvents({ ongoing: {}, past: {} });
      navigate("/");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
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
      // setModalVisible(false);
      fetchFriends();
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
              fetchFriends();
            },
          },
        ]
      );
    } catch (error) {
      alert(error.response.data.detail);
    }
  };

  const fetchFriends = async () => {
    try {
      setFriends(await getFriends(userDetails.user_id));
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
    fetchFriends();
    fetchFriendRequests();
    console.log(friendRequests);
  }, []);

  const handleProfilePictureChange = async () => {
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

      const uploadUrl = await uploadImageAsync(
        pickerResult.assets[0].uri,
        `/profile_pictures/${userDetails.user_id}`
      );

      console.log(uploadUrl);

      const response = await updateProfilePicture(
        userDetails.user_id,
        uploadUrl
      );

      console.log(response);

      setUserDetails({ ...userDetails, profile_picture_url: uploadUrl });
    } catch (error) {
      console.error("An error occurred:", error.response.data.detail);
    }
  };

  return (
    <View style={[styles.page, { paddingBottom: insets.bottom }]}>
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
          <View>
            <NotificationBell
              height={HEADER_ICON_DIMENSION}
              width={HEADER_ICON_DIMENSION}
              style={{ color: theme.PRIMARY }}
            />
            {friendRequests.length > 0 && (
              <View
                style={{
                  position: "absolute",
                  right: -5,
                  top: 0,
                  backgroundColor: theme.RED,
                  borderRadius: 100,
                  height: 20,
                  width: 20,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Body
                  adjustsFontSizeToFit={true}
                  bold={true}
                  style={{ color: theme.PRIMARY }}
                >
                  {friendRequests.length}
                </Body>
              </View>
            )}
          </View>
        }
        onPressRight={() => {
          if (friendRequests.length > 0) {
            setModalVisible(!modalVisible);
          }
        }}
      />

      {/* TODO: FIX THE SCROLL IN THE MODAL */}
      <Modal
        animationType="fade"
        presentationStyle="overFullScreen"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
            backgroundColor: `${theme.BACKGROUND}95`,
          }}
          activeOpacity={1}
          onPressOut={() => setModalVisible(!modalVisible)}
        >
          <View
            style={{
              backgroundColor: `${theme.DARK}`,
              width: "80%",
              maxHeight: "80%",
              borderRadius: 20,
              padding: 20,
              elevation: 200,
              shadowColor: theme.DARK,
              shadowOpacity: 1,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 10,
            }}
            onStartShouldSetResponder={() => true}
          >
            <View style={{ paddingBottom: 10, paddingHorizontal: 5 }}>
              <Body size={16}>FRIEND REQUESTS ({friendRequests.length})</Body>
            </View>

            <FriendRequestList
              friendRequests={friendRequests}
              onPressTick={handleAcceptFriend}
              onPressCross={handleRejectFriend}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      <AnimatedView
        animation={animation}
        duration={ANIMATION_DURATION}
        style={styles.page}
      >
        <View style={styles.container}>
          <View style={styles.profileImage}>
            <View>
              {userDetails.profile_picture_url ? (
                <Image
                  source={{ uri: userDetails.profile_picture_url }}
                  style={{
                    width: 150,
                    height: 150,
                    borderRadius: 100,
                  }}
                />
              ) : (
                <ProfileIcon
                  height={40}
                  width={40}
                  style={{ color: theme.PRIMARY }}
                />
              )}

              <Pressable
                onPress={handleProfilePictureChange}
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

            <View style={{ paddingTop: 10 }}>
              <Body style={{ textAlign: "center" }} size={16}>
                {userDetails.first_name} {userDetails.last_name}
              </Body>
              <Body
                style={{ textAlign: "center", color: theme.PLACEHOLDER }}
                size={14}
              >
                {userDetails.username}
              </Body>
            </View>
          </View>

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
              <Body size={14}>MY FRIENDS ({friends.length})</Body>
            </View>
            <FriendList friends={friends} onPress={handleRemoveFriend} />
          </View>
          <Button
            fill={theme.TEXT}
            textColor={theme.BACKGROUND}
            onPress={handleLogout}
          >
            logout
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
  profileImage: {
    marginTop: 20,
    width: "100%",
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
});
