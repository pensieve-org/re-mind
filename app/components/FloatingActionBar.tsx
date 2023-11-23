import React, { useState } from "react";
import { StyleSheet, Pressable, View } from "react-native";
import Body from "./Body";
import theme from "../assets/theme";

interface Props {
  items: string[];
  initialSelectedItem: string;
  onPressItem: (item: string) => void;
}

const FloatingActionBar: React.FC<Props> = ({
  items,
  initialSelectedItem: initialSelectedItem,
  onPressItem,
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
