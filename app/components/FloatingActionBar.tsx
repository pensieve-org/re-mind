import React, { useState } from "react";
import { StyleSheet, Pressable, View } from "react-native";
import Body from "./Body";
import theme from "../assets/theme";

interface Props {
  items: string[];
  initialSelectedItem: string;
  onPressItem: (item: string) => void;
  friendRequests?: number;
}

const FloatingActionBar: React.FC<Props> = ({
  items,
  initialSelectedItem: initialSelectedItem,
  onPressItem,
  friendRequests = 0,
}) => {
  const [selectedItem, setSelectedItem] = useState<string | null>(
    initialSelectedItem
  );

  const handlePress = (item: string) => {
    setSelectedItem(item);
    onPressItem(item);
  };

  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <Pressable
          key={index}
          style={{
            backgroundColor:
              item === selectedItem ? theme.PLACEHOLDER : "transparent",
            borderRadius: 50,
            padding: 10,
            marginRight: index < items.length - 1 ? 10 : 0,
          }}
          onPress={() => handlePress(item)}
        >
          <Body style={{ color: theme.TEXT }} bold={true} size={14}>
            {item}
          </Body>
          {item === "Requests" && friendRequests > 0 && (
            <View
              style={{
                position: "absolute",
                right: -8,
                top: -4,
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
                {friendRequests}
              </Body>
            </View>
          )}
        </Pressable>
      ))}
    </View>
  );
};

export default FloatingActionBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: `${theme.DARK}95`,
    alignItems: "center",
    alignSelf: "center",
    alignContent: "center",
    padding: 10,
    borderRadius: 50,
  },
});
