import { StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import Title from "../components/Title";

export default function Page() {
  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <Title style={styles.title} size={16}>
          RE:MIND
        </Title>
        <Link style={styles.subtitle} href="/page1">
          page 1
        </Link>
        <Link style={styles.subtitle} href="/page2">
          page 2
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
    color: "blue",
    textDecorationLine: "underline",
  },
});
