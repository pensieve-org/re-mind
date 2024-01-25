import { useContext, useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import * as MediaLibrary from "expo-media-library";

import { AppContext } from "../_layout";
import geUserEvents from "../../apis/getUserEvents";
import theme from "../../assets/theme";
import { HORIZONTAL_PADDING } from "../../assets/constants";
import handleImageUpload from "../../utils/handleImageUpload";
// import * as BackgroundFetch from "expo-background-fetch";
// import * as TaskManager from "expo-task-manager";
// const BACKGROUND_FETCH_TASK = "background-fetch";

// TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
//   try {
//     alert(`Background fetch called at ${new Date().toISOString()}`);
//     await handleImageUpload(5);
//   } catch (err) {
//     console.error("Background fetch failed:", err);
//   }
// });

// async function registerBackgroundFetchTask() {
//   return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
//     minimumInterval: 15,
//     stopOnTerminate: false,
//     startOnBoot: true,
//   });
// }

export default function Page() {
  const insets = useSafeAreaInsets();
  const { setUserDetails, setUserEvents } = useContext(AppContext);

  const checkLogin = async () => {
    const user = await AsyncStorage.getItem("@user");
    if (user) {
      try {
        // TODO: also read friends, events, requests...
        const userJSON = JSON.parse(user);
        setUserDetails(userJSON);
        setUserEvents(await geUserEvents(userJSON.userId));
        router.replace("/home");
      } catch (error) {
        console.log(error);
        router.replace("/entry");
      }
    } else {
      router.replace("/entry");
    }
  };

  useEffect(() => {
    (async () => {
      await checkLogin();
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access media library is not granted");
      }
      // await registerBackgroundFetchTask();
      handleImageUpload(5);
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
