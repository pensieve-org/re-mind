import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View, Image, Pressable } from "react-native";
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
  PROFILE_ICON_DIMENSION,
} from "../../assets/constants";
import auth from "../../firebase.js";
import Body from "../../components/Body";
import Button from "../../components/Button";
import Header from "../../components/Header";
import { AppContext } from "../_layout";
import getFriendRequests from "../../services/get.friendRequests";
import FriendsIcon from "../../assets/friends.svg";
import ProfileIcon from "../../assets/profile.svg";
import CameraIcon from "../../assets/camera.svg";
import * as ImagePicker from "expo-image-picker";
import updateProfilePicture from "../../services/update.profilePicture";
import { uploadImageAsync } from "../../utils";

// TODO: add bottom nav and have 3 tabs, profile, add friends and my friends
// TODO: add a notification bell in the header on the right to accept friend reqs
export default function Profile() {
  const { userDetails, setUserDetails, setSelectedEvent, setUserEvents } =
    useContext(AppContext);
  const [animation, setAnimation] = useState(ANIMATION_ENTRY);
  const [friendRequests, setFriendRequests] = useState([]);
  const insets = useSafeAreaInsets();

  const navigate = (route) => {
    setAnimation(ANIMATION_EXIT);
    setTimeout(() => {
      router.replace(route);
    }, ANIMATION_DURATION);
  };

  const navigatePush = (route) => {
    setAnimation(ANIMATION_EXIT);
    setTimeout(() => {
      router.push(route);
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
            <FriendsIcon
              height={HEADER_ICON_DIMENSION}
              width={HEADER_ICON_DIMENSION}
              style={{ color: theme.PRIMARY }}
            />
            {friendRequests.length > 0 && (
              <View
                style={{
                  position: "absolute",
                  right: -12,
                  top: -10,
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
          navigatePush("/friends");
        }}
      />

      <AnimatedView
        animation={animation}
        duration={ANIMATION_DURATION}
        style={styles.page}
      >
        <View style={styles.container}>
          <View style={styles.profileImage}>
            <View>
              <View
                style={{
                  width: PROFILE_ICON_DIMENSION,
                  height: PROFILE_ICON_DIMENSION,
                  borderRadius: 100,
                  backgroundColor: userDetails.profile_picture_url
                    ? "transparent"
                    : theme.PLACEHOLDER,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {userDetails.profile_picture_url ? (
                  <Image
                    source={{ uri: userDetails.profile_picture_url }}
                    style={{
                      width: PROFILE_ICON_DIMENSION,
                      height: PROFILE_ICON_DIMENSION,
                      borderRadius: 100,
                    }}
                  />
                ) : (
                  <ProfileIcon
                    height={90}
                    width={90}
                    style={{ color: theme.PRIMARY }}
                  />
                )}
              </View>

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

          <View style={{ flex: 1 }} />

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
