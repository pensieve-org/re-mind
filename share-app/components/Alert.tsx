import React from "react";
import { View, StyleSheet } from "react-native";
import Body from "./Body";

const Alert = ({ text }) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Body style={styles.text} size={40}>
          !
        </Body>
      </View>
      <View style={styles.textContainer}>
        <Body style={styles.text}>{text}</Body>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
    paddingHorizontal: 50,
  },
  iconContainer: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  textContainer: {
    flex: 7,
    justifyContent: "center",
  },
  text: {
    color: "black",
  },
});

export default Alert;
