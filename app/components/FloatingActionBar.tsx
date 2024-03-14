import React, { useState, useEffect } from "react";
import { StyleSheet, Pressable, View } from "react-native";
import Body from "./Body";
import theme from "../assets/theme";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

const itemWidth = 100; // Adjust this based on your item width
const padding = 10;
interface Props {
  items: string[];
  initialSelectedItem: string;
  onPressItem: (item: string) => void;
  friendRequests?: number;
}

const FloatingActionBar: React.FC<Props> = ({
  items,
  initialSelectedItem,
  onPressItem,
  friendRequests = 0,
}) => {
  const [selectedItem, setSelectedItem] = useState<string | null>(
    initialSelectedItem
  );
  const highlightPosition = useSharedValue(0);

  useEffect(() => {
    const index = items.indexOf(selectedItem);
    highlightPosition.value = withTiming(index * itemWidth + padding, {
      duration: 300,
    });
  }, [selectedItem, items, highlightPosition]);

  const highlightStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: highlightPosition.value }],
    };
  });

  const handlePress = (item: string) => {
    setSelectedItem(item);
    onPressItem(item);
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.highlight, highlightStyle]} />
      {items.map((item, index) => (
        <Pressable
          key={index}
          style={{
            width: itemWidth,
            borderRadius: 50,
            padding: padding,
            alignItems: "center",
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
    padding: padding,
    borderRadius: 50,
    position: "relative",
  },
  highlight: {
    position: "absolute",
    height: "100%",
    width: itemWidth, // Adjust this based on your item width
    backgroundColor: theme.PLACEHOLDER,
    borderRadius: 50,
    left: 0,
  },
});
