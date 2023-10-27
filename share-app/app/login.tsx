import { StyleSheet, Text, View, Image } from "react-native";
import { Link } from "expo-router";
import Header from "../components/Header";

export default function Page() {
  return (
    <View style={{ backgroundColor: "#000", flex: 1 }}>
      <Header
        imageLeft={<Image source={require("../assets/arrow-left.png")} />}
        routeLeft="/"
      />
      <View style={styles.container}>
        <Text style={styles.title}>Page 1</Text>
        <Text style={styles.subtitle}>This is the first page</Text>
        <Link style={styles.link} href="/">
          back
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 20,
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
    color: "#FFF",
  },
  subtitle: {
    fontSize: 36,
    color: "#FFF",
  },
  link: {
    fontSize: 36,
    color: "blue",
    textDecorationLine: "underline",
  },
});
