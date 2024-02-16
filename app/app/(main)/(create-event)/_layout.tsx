import { View } from "react-native"; // Import View from react-native
import { Stack } from "expo-router";
import theme from "../../../assets/theme";
import Title from "../../../components/Title"; // Assuming the path to your Title component

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="create-event" options={{ headerShown: false }} />
      <Stack.Screen
        name="location-modal"
        options={{
          presentation: "modal",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
