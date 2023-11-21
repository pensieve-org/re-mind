import React from "react";
import { StyleSheet, View, Image, FlatList } from "react-native";
import Body from "./Body";
import { PROFILE_ICON_DIAMETER } from "../assets/constants";
import theme from "../assets/theme";
import Plus from "/Users/jamesheavey/Documents/GitHub/re-mind/app/assets/plus.svg";
import { TouchableOpacity } from "react-native-gesture-handler";
import { getRandomColor } from "../utils";

// TODO: Remove the initials avatar when we add default profile image
const InitialsAvatar = ({ initials }) => (
  <View style={[styles.imageContainer, { backgroundColor: getRandomColor() }]}>
    <Body style={styles.initialsText}>{initials}</Body>
  </View>
);

interface Props {
  friends: any[];
  onPress?: (friend) => void;
}

const FriendList: React.FC<Props> = ({ friends, onPress }) => {
  const handleOnPress = (friend) => {
    onPress(friend);
  };

  const renderItem = ({ item }) => {
    const initials = item.first_name[0] + item.last_name[0];
    return (
      <View style={styles.itemContainer}>
        <View style={styles.profileSection}>
          <View style={styles.imageContainer}>
            {item.profile_picture_url ? (
              <Image
                source={{ uri: item.profile_picture_url }}
                style={styles.image}
              />
            ) : (
              <InitialsAvatar initials={initials} />
            )}
          </View>

          <View style={styles.textContainer}>
            <Body adjustsFontSizeToFit>
              {item.first_name} {item.last_name}
            </Body>
            <Body style={styles.usernameText} adjustsFontSizeToFit>
              {item.username}
            </Body>
          </View>
        </View>

        <TouchableOpacity onPress={() => handleOnPress(item)}>
          <Plus height={30} width={30} style={styles.plusIconStyle} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <FlatList
      data={friends}
      renderItem={renderItem}
      keyExtractor={(item, index) => String(index)}
    />
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: 5,
  },
  imageContainer: {
    width: PROFILE_ICON_DIAMETER,
    height: PROFILE_ICON_DIAMETER,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    textAlign: "left",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 100,
  },
  initialsText: {
    color: "#fff",
    fontSize: 20,
  },

  profileSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  textContainer: {
    marginLeft: 20,
  },
  usernameText: {
    color: theme.PLACEHOLDER,
    fontSize: 14,
  },
  plusIconStyle: {
    transform: [{ rotate: "45deg" }],
  },
});

export default FriendList;
