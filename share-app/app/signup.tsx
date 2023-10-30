import { StyleSheet, View } from "react-native";
import { Link } from "expo-router";
import theme from "../assets/theme";
import { HORIZONTAL_PADDING } from "../assets/constants";

export default function Page() {
  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <Link href="/">back</Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: theme.BACKGROUND,
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: "flex-start",
    marginHorizontal: HORIZONTAL_PADDING,
  },
});
