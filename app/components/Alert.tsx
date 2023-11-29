import React from "react";
import { View, StyleSheet } from "react-native";
import Body from "./Body";
import theme from "../assets/theme";

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
    backgroundColor: theme.ERROR_BACKGROUND,
    padding: 16,
    paddingHorizontal: 50,
    height: 80,
  },
  iconContainer: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  textContainer: {
    justifyContent: "center",
  },
  text: {
    color: theme.ERROR_TEXT,
    flexWrap: "wrap",
  },
});

export default Alert;
