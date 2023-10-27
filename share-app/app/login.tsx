import { StyleSheet, Text, View, Image } from "react-native";
import { Link } from "expo-router";
import Header from "../components/Header";
import Body from "../components/Body";

export default function Page() {
  return (
    <View style={{ backgroundColor: "#000", flex: 1 }}>
      <Header
        imageLeft={<Image source={require("../assets/arrow-left.png")} />}
        routeLeft="/"
      />
      <View style={styles.container}>
        <Body style={styles.subtitle} size={35}>
          login
        </Body>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start",
    marginHorizontal: 28,
  },
  subtitle: {
    justifyContent: "flex-start",
    textAlign: "left",
    fontWeight: 600,
  },
});
