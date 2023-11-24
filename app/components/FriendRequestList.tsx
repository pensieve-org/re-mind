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
  friendRequests: any[];
  onPressTick?: (friend) => void;
  onPressCross?: (friend) => void;
}

const FriendRequestList: React.FC<Props> = ({
  friendRequests,
  onPressTick,
  onPressCross,
}) => {
  const handleOnPressCross = (friend) => {
    onPressCross(friend);
  };
  const handleOnPressTick = (friend) => {
    onPressTick(friend);
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
                  : theme.PLACEHOLDER,
                width: PROFILE_ICON_DIAMETER,
                height: PROFILE_ICON_DIAMETER,
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

          <View style={{ marginLeft: 20 }}>
            <Body adjustsFontSizeToFit>
              {item.first_name} {item.last_name}
            </Body>
            <Body style={styles.usernameText} adjustsFontSizeToFit>
              {item.username}
            </Body>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={{ paddingRight: 5 }}
            onPress={() => handleOnPressTick(item)}
          >
            <Check height={30} width={30} style={styles.checkIconStyle} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleOnPressCross(item)}>
            <Plus height={30} width={30} style={styles.plusIconStyle} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={friendRequests}
      renderItem={renderItem}
      keyExtractor={(item, index) => String(index)}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 80 }}
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
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 100,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
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

export default FriendRequestList;
