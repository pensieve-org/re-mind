import React from "react";
import { StyleSheet, View, Image, FlatList } from "react-native";
import Body from "./Body";
import { PROFILE_ICON_DIAMETER } from "../assets/constants";
import theme from "../assets/theme";
import Plus from "../assets/plus.svg";
import Check from "../assets/check-solid.svg";
import { TouchableOpacity } from "react-native-gesture-handler";
import ProfileIcon from "../assets/profile.svg";
interface Props {
  friends: any[];
  onPress?: (friend) => void;
  add?: boolean;
}

const FriendList: React.FC<Props> = ({ friends, onPress, add = false }) => {
  const handleOnPress = (friend) => {
    onPress(friend);
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.itemContainer}>
        <View style={styles.profileSection}>
          <View
            style={[
              styles.imageContainer,
              {
                backgroundColor: item.profile_picture_url
                  ? "transparent"
                  : theme.DARK,
              },
            ]}
          >
            {item.profile_picture_url ? (
              <Image
                source={{ uri: item.profile_picture_url }}
                style={styles.image}
              />
            ) : (
              <ProfileIcon
                height={40}
                width={40}
                style={{ color: theme.PRIMARY }}
              />
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
          {add ? (
            <Check height={25} width={25} style={styles.checkIconStyle} />
          ) : (
            <Plus height={30} width={30} style={styles.plusIconStyle} />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <FlatList
      data={friends}
      renderItem={renderItem}
      keyExtractor={(item, index) => String(index)}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
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
    color: theme.PLACEHOLDER,
  },
  checkIconStyle: {
    color: theme.PRIMARY,
  },
});

export default FriendList;
