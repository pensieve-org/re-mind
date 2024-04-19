import React from "react";
import { StyleSheet, View } from "react-native";
import theme from "../assets/theme";
import { COMPONENT_HEIGHT, CORNER_RADIUS } from "../assets/constants";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import LocationDot from "../assets/location-dot.svg";
interface InputProps {
  placeholder?: string;
  onPress?: (data: any, details: any) => void;
}

const LocationSearchBar: React.FC<InputProps> = ({ placeholder, onPress }) => {
  return (
    <View style={styles.container}>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <LocationDot height={30} width={30} style={{ color: theme.RED }} />
      </View>
      <GooglePlacesAutocomplete
        placeholder={placeholder}
        onPress={(data, details) => onPress(data, details)}
        query={{
          key: process.env.EXPO_PUBLIC_GOOGLE_API,
          language: "en",
        }}
        fetchDetails={true}
        styles={{
          textInputContainer: {
            backgroundColor: "transparent",
            width: "100%",
          },
          textInput: {
            height: 38,
            color: theme.TEXT,
            fontSize: 20,
            fontFamily: "MontserratSemibold",
            letterSpacing: -0.408,
            backgroundColor: "transparent",
          },
          predefinedPlacesDescription: {
            color: "#1faadb",
          },
          listView: {
            backgroundColor: "white",
            position: "absolute",
            top: 40,
            width: "100%",
            zIndex: 1000,
            borderRadius: CORNER_RADIUS,
          },
        }}
        textInputProps={{
          placeholderTextColor: theme.PLACEHOLDER,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: COMPONENT_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 1000,
  },
});

export default LocationSearchBar;
