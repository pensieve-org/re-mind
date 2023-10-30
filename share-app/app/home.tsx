import { StyleSheet, Image, View } from "react-native";
import { router } from "expo-router";
import Header from "../components/Header";
import Body from "../components/Body";
import theme from "../assets/theme";
import { HORIZONTAL_PADDING } from "../assets/constants";

export default function Home() {
  return (
    <View style={styles.page}>
      <Header
        imageLeft={
          <View
            style={{
              width: 30,
              height: 30,
              borderRadius: 100,
              backgroundColor: "blue",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Body
              style={{
                textAlign: "center",
              }}
            >
              E
            </Body>
          </View>
        }
        onPressLeft={() => router.replace("/")}
        imageRight={<Image source={require("../assets/plus.png")} />}
      />
      <View style={styles.container}>
        <Body style={styles.subtitle} size={23}>
          memories
        </Body>
        <Body style={styles.subtitle} size={20}>
          ongoing
        </Body>
        <Body style={styles.subtitle} size={20}>
          past
        </Body>
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
  subtitle: {
    justifyContent: "flex-start",
    textAlign: "left",
    fontWeight: 600,
    paddingVertical: 16,
  },
});
