import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  Pressable,
  ActivityIndicator,
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
  PROFILE_ICON_DIMENSION,
} from "../../assets/constants";
import { auth } from "../../firebase.js";
import Body from "../../components/Body";
import Button from "../../components/Button";
import Header from "../../components/Header";
import { AppContext } from "../_layout";
import getFriendRequests from "../../services/getFriendRequests";
import FriendsIcon from "../../assets/friends.svg";
import ProfileIcon from "../../assets/profile.svg";
import CameraIcon from "../../assets/camera.svg";
import * as ImagePicker from "expo-image-picker";
import updateProfilePicture from "../../services/updateProfilePicture";
import { uploadImageAsync } from "../../utils";

export default function Profile() {
  const { userDetails, setUserDetails, setSelectedEvent, setUserEvents } =
    useContext(AppContext);
  const [animation, setAnimation] = useState(ANIMATION_ENTRY);
  const [friendRequests, setFriendRequests] = useState([]);
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);

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
      setSelectedEvent({});
      setUserEvents({});
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

      setIsLoading(true);

      const uploadUrl = await uploadImageAsync(
        pickerResult.assets[0].uri,
        `/profile_pictures/${userDetails.userId}`
      );

      console.log(uploadUrl);

      await updateProfilePicture(userDetails.userId, uploadUrl);

      setUserDetails({ ...userDetails, profilePicture: uploadUrl });
      await AsyncStorage.setItem("@user", JSON.stringify(userDetails));

      setIsLoading(false);
    } catch (error) {
      console.error("An error occurred:", error.message);
    }
  };

  const fetchFriendRequests = async () => {
    try {
      setFriendRequests(await getFriendRequests(userDetails.userId));
    } catch (error) {
      alert(error.message);
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
                  backgroundColor: theme.PLACEHOLDER,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {isLoading ? (
                  <ActivityIndicator
                    style={styles.loading}
                    size={"large"}
                    color={theme.PRIMARY}
                  />
                ) : userDetails.profilePicture ? (
                  <Image
                    source={{ uri: userDetails.profilePicture }}
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
                {userDetails.firstName} {userDetails.lastName}
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
  loading: {
    width: "100%",
    justifyContent: "center",
    paddingTop: 30,
  },
});
