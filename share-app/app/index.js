import { StyleSheet, Text, Image, View } from "react-native";
import { Link } from "expo-router";
import Title from "../components/Title";
import Body from "../components/Body";
import Button from "../components/Button";

export default function Page() {
  return (
    <View style={styles.container}>
      <Title size={55}>re:mind</Title>
      <Body size={20}>memory capture</Body>

      <Image style={styles.image} source={require("../assets/logo.png")} />

      <View style={styles.buttonContainer}>
        <Button route="/page1">login</Button>
        <Button route="/page2">sign up</Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // marginHorizontal: "auto",
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
