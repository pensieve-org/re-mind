import { StyleSheet, Text, Image, View } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Title from "../components/Title";
import Body from "../components/Body";
import Button from "../components/Button";

export default function Page() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Title size={55}>re:mind</Title>
      <Body size={20}>memory capture</Body>

      <Image style={styles.image} source={require("../assets/logo.png")} />

      <View style={styles.buttonContainer}>
        <Button onPress={() => router.replace("/login")}>login</Button>
        <Button onPress={() => router.replace("/signup")}>sign up</Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: 20,
  },
  image: {
    // width: 100, // Set your desired width
    // height: 100, // Set your desired height
    // marginBottom: 20, // Optional: add some margin if needed
  },
});
