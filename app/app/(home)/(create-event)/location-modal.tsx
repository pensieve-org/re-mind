import { StyleSheet, View } from "react-native";
import { Link, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import MapView from "react-native-maps";
import { TextInput } from "react-native-gesture-handler";

export default function Modal() {
  // If the page was reloaded or navigated to directly, then the modal should be presented as
  // a full screen page. You may need to change the UI to account for this.
  const isPresented = router.canGoBack();
  return (
    <View
      style={{ flex: 1, alignItems: "center", justifyContent: "flex-start" }}
    >
      {/* Use `../` as a simple way to navigate to the root. This is not analogous to "goBack". */}
      {!isPresented && <Link href="../">Dismiss</Link>}
      {/* Native modals have dark backgrounds on iOS, set the status bar to light content. */}
      <StatusBar style="light" />
      <View style={{ paddingVertical: 20 }}>
        <TextInput placeholder="Search" />
      </View>
      <MapView style={styles.map} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "90%",
    height: 400,
    borderRadius: 10,
  },
});
