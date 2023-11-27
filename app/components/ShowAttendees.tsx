import React from "react";
import { StyleSheet, View, Image, ScrollView } from "react-native";
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
  attendees: any[];
}

const AddFriendsList: React.FC<Props> = ({ attendees }) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.container}>
        {attendees.map((attendee, index) => (
          <View
            key={index}
            style={{
              marginBottom: FRIEND_ICON_GAP_BOTTOM,
              marginRight:
                (index + 1) % FRIEND_ROW_ICONS === 0 ? 0 : FRIEND_ICON_GAP,
              alignItems: "center",
            }}
          >
            <View
              style={[
                styles.imageContainer,
                {
                  backgroundColor: attendee.profile_picture_url
                    ? "transparent"
                    : theme.PLACEHOLDER,
                },
              ]}
            >
              {attendee.profile_picture_url ? (
                <Image
                  source={{ uri: attendee.profile_picture_url }}
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
              {attendee.first_name} {attendee.last_name}
            </Body>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "flex-start",
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
