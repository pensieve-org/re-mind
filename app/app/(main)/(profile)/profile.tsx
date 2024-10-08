import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, Stack } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signOut } from "firebase/auth";
import theme from "../../../assets/theme";
import {
  HEADER_ICON_DIMENSION,
  HORIZONTAL_PADDING,
  PROFILE_ICON_DIMENSION,
  ANIMATED_BORDER_RADIUS,
} from "../../../assets/constants";
import { auth } from "../../../firebase.js";
import Body from "../../../components/Body";
import Button from "../../../components/Button";
import { AppContext } from "../../_layout";
import getFriendRequests from "../../../apis/getFriendRequests";
import FriendsIcon from "../../../assets/friends.svg";
import ProfileIcon from "../../../assets/profile.svg";
import CameraIcon from "../../../assets/camera.svg";
import * as ImagePicker from "expo-image-picker";
import updateProfilePicture from "../../../apis/updateProfilePicture";
import uploadImageAsync from "../../../utils/uploadImageAsync";
import deleteUser from "../../../apis/deleteUser";
import { AnimatedImage } from "../../../utils/AnimatedImage";
import Header from "../../../components/Header";
import { useHeaderProps } from "../../../hooks/useHeaderProps";

export default function Profile() {
  const { userDetails, setUserDetails, setSelectedEvent, setUserEvents } =
    useContext(AppContext);
  const [friendRequests, setFriendRequests] = useState([]);
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);
  const headerProps = useHeaderProps();

  const clearContext = () => {
    setUserDetails({});
    setSelectedEvent({});
    setUserEvents([]);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.clear();
      clearContext();
      router.replace("/");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const handleDeleteUser = async () => {
    try {
      Alert.alert(
        "Confirmation",
        `Are you sure you want to delete your account?`,
        [
          { text: "No" },
          {
            text: "Yes",
            onPress: async () => {
              await deleteUser(userDetails.userId);
              await AsyncStorage.clear();
              clearContext();
              router.replace("/");
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error deleting user: ", error);
    }
  };

  const handleProfilePictureChange = async () => {
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

      setIsLoading(true);

      const uploadUrl = await uploadImageAsync(
        pickerResult.assets[0].uri,
        `/users/${userDetails.userId}/profile_picture`
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
      <Stack.Screen
        options={{
          header: () => (
            <Header
              {...headerProps}
              onPressRight={() => router.push("/friends")}
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
            />
          ),
        }}
      />

      <View style={styles.container}>
        <View style={styles.profileImage}>
          <View>
            <View
              style={{
                width: PROFILE_ICON_DIMENSION,
                height: PROFILE_ICON_DIMENSION,
                borderRadius: 100,
                backgroundColor: userDetails.profilePicture
                  ? "transparent"
                  : theme.PLACEHOLDER,
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              {isLoading ? (
                <ActivityIndicator size={"large"} color={theme.PRIMARY} />
              ) : userDetails.profilePicture ? (
                <Image
                  source={{ uri: userDetails.profilePicture }}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: ANIMATED_BORDER_RADIUS,
                  }}
                  // sharedTransitionTag="profile-picture"
                  cachePolicy={"memory-disk"}
                  priority={"high"}
                />
              ) : (
                <ProfileIcon
                  height={"50%"}
                  width={"50%"}
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

        <View style={{ paddingVertical: 20 }}>
          <Button
            fill={theme.TEXT}
            textColor={theme.BACKGROUND}
            onPress={handleLogout}
          >
            logout
          </Button>
        </View>

        <Button
          fill={theme.TEXT}
          textColor={theme.BACKGROUND}
          onPress={handleDeleteUser}
        >
          delete user
        </Button>
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
  profileImage: {
    marginTop: 20,
    width: "100%",
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
});
