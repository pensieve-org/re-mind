import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import Body from "./Body";
import {
  FRIEND_ICON_DIAMETER,
  FRIEND_ICON_GAP,
  FRIEND_ICON_GAP_BOTTOM,
  FRIEND_ROW_ICONS,
} from "../assets/constants";
import ProfileIcon from "../assets/profile.svg";
import theme from "../assets/theme";

interface Props {
  unselectedFriends: any[];
  selectedFriends: any[];
  setSelectedFriends: (friends: any[]) => void;
  setUnselectedFriends: (friends: any[]) => void;
}

const AddFriendsList: React.FC<Props> = ({
  unselectedFriends,
  selectedFriends,
  setSelectedFriends,
  setUnselectedFriends,
}) => {
  const handleOnPress = (friend) => {
    setSelectedFriends([...selectedFriends, friend]);
    setUnselectedFriends(unselectedFriends.filter((f) => f !== friend));
  };

  return (
    <View style={styles.container}>
      {unselectedFriends.map((friend, index) => (
        <TouchableOpacity
          key={index}
          style={{
            marginBottom: FRIEND_ICON_GAP_BOTTOM,
            marginRight:
              (index + 1) % FRIEND_ROW_ICONS === 0 ? 0 : FRIEND_ICON_GAP,
            alignItems: "center",
          }}
          onPress={() => handleOnPress(friend)}
        >
          <View
            style={[
              styles.imageContainer,
              {
                backgroundColor: friend.profilePicture
                  ? "transparent"
                  : theme.PLACEHOLDER,
              },
            ]}
          >
            {friend.profilePicture ? (
              <Image
                source={{ uri: friend.profilePicture }}
                style={styles.image}
              />
            ) : (
              <ProfileIcon
                height={FRIEND_ICON_DIAMETER - 40}
                width={FRIEND_ICON_DIAMETER - 40}
                style={{ color: theme.PRIMARY }}
              />
            )}
          </View>
          <Body size={12} style={styles.text} numberOfLines={2}>
            {friend.firstName} {friend.lastName}
          </Body>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "flex-start",
    flexWrap: "wrap",
  },
  imageContainer: {
    width: FRIEND_ICON_DIAMETER,
    height: FRIEND_ICON_DIAMETER,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    padding: 10,
    textAlign: "center",
    flexWrap: "wrap",
    width: FRIEND_ICON_DIAMETER,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 100,
  },
});

export default AddFriendsList;
