import { StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";

export default function Home() {
  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <Text style={styles.title}>Page 2</Text>
        <Text style={styles.subtitle}>This is the second page</Text>
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
