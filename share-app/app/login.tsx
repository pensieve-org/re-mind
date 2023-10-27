import { StyleSheet, Text, View, Image } from "react-native";
import { Link } from "expo-router";
import Header from "../components/Header";

export default function Page() {
  return (
    <View style={{ flex: 1 }}>
      <Header
        imageLeft={<Image source={require("../assets/arrow-left.png")} />}
        routeLeft="/"
      />
      <View style={styles.main}>
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
    padding: 24,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 36,
    color: "#38434D",
  },
  link: {
    fontSize: 36,
    color: "blue",
    textDecorationLine: "underline",
  },
});
