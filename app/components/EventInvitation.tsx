import React from "react";
import { StyleSheet, View } from "react-native";
import Body from "./Body";
import theme from "../assets/theme";
import Plus from "../assets/plus.svg";
import Check from "../assets/check-solid.svg";
import { TouchableOpacity } from "react-native-gesture-handler";

interface Props {
  onPress: (bool) => void;
}

const EventInvitation: React.FC<Props> = ({ onPress }) => {
  const handleOnPress = (bool) => {
    onPress(bool);
  };
  return (
    <View style={styles.itemContainer}>
      <Body adjustsFontSizeToFit>accept event invitation?</Body>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={{ paddingRight: 5 }}
          onPress={() => handleOnPress(true)}
        >
          <Check height={30} width={30} style={styles.checkIconStyle} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleOnPress(false)}>
          <Plus height={30} width={30} style={styles.plusIconStyle} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: theme.PLACEHOLDER,
    borderRadius: 10,
  },
  plusIconStyle: {
    transform: [{ rotate: "45deg" }],
    color: theme.PRIMARY,
  },
  checkIconStyle: {
    color: theme.PRIMARY,
  },
});

export default EventInvitation;
