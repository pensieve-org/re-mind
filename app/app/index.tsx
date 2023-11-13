import { ActivityIndicator, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import theme from "../assets/theme";
import { HORIZONTAL_PADDING } from "../assets/constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import getAllUserEvents from "../services/get.allUserEvents";
import { useContext, useEffect } from "react";
import { AppContext } from "./_layout";

export default function Page() {
  const insets = useSafeAreaInsets();
  const { setUserDetails, userDetails, setUserEvents } = useContext(AppContext);

  const checkLogin = async () => {
    const user = await AsyncStorage.getItem("@user");
    if (user) {
      setUserDetails(JSON.parse(user));
      setUserEvents(await getAllUserEvents(userDetails.id));
      router.replace("/home");
    } else {
      router.replace("/entry");
    }
  };

  useEffect(() => {
    (async () => {
      await checkLogin();
    })();
  }, []);

  return (
    <View style={styles.page}>
      <StatusBar style="light" />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* TODO: replace with a cool animation of dish filling up  */}
        {/* TODO: move font loading in here? */}
        <ActivityIndicator size="large" color={theme.PRIMARY} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: theme.BACKGROUND,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: HORIZONTAL_PADDING,
  },
});
