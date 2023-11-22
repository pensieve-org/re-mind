import React, { useContext, useEffect, useState } from "react";
import { Alert, StyleSheet, View, Image, Pressable } from "react-native";
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
import addFriend from "../../services/add.friend";
import getFriends from "../../services/get.friends";
import removeFriend from "../../services/remove.friend";
import AddFriend from "../../components/AddFriend";
import NotificationBell from "../../assets/bell.svg";
import ProfileIcon from "../../assets/profile.svg";
import CameraIcon from "../../assets/camera.svg";
import { TouchableOpacity } from "react-native-gesture-handler";

// TODO: add bottom nav and have 3 tabs, profile, add friends and my friends
// TODO: add a notification bell in the header on the right to accept friend reqs
export default function Profile() {
  const { userDetails, setUserDetails, setSelectedEvent, setUserEvents } =
    useContext(AppContext);
  const [animation, setAnimation] = useState(ANIMATION_ENTRY);
  const [friends, setFriends] = useState([]);
  const [friendUsername, setFriendUsername] = useState("");
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
      setUserDetails({});
      setSelectedEvent({ images: {}, id: "" });
      setUserEvents({ ongoing: {}, past: {} });
      await AsyncStorage.clear();
      navigate("/");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  // TODO: remove alerts and do better error display
  const handleAddFriend = async () => {
    try {
      await addFriend(userDetails.user_id, friendUsername);
      fetchFriends();
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

  useEffect(() => {
    fetchFriends();
  }, []);

  const handleProfilePictureUpload = () => {
    console.log("upload profile picture");
    // TODO: prompt user to upload a profile picture from their camera roll
    // this will then be uploaded to firebase image store and the url will be
    // saved to the user's profile_picture_url field in the database
    // then we will refresh the user details and voila
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
          <NotificationBell
            height={HEADER_ICON_DIMENSION}
            width={HEADER_ICON_DIMENSION}
            style={{ color: theme.PRIMARY }}
          />
        }
        onPressRight={() => {}}
      />
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
                onPress={handleProfilePictureUpload}
                style={({ pressed }) => [
                  {
                    position: "absolute",
                    right: 0,
                    bottom: 0,
                  },
                  pressed ? { opacity: 0.8 } : {},
                ]}
              >
                <CameraIcon
                  height={37}
                  width={37}
                  style={{ color: theme.PRIMARY }}
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
              onPress={handleAddFriend}
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
