import React from "react";
import { StyleSheet, View } from "react-native";
import { TextInput as PaperTextInput } from "react-native-paper";
import Body from "./Body";
import theme from "../assets/theme";
import { COMPONENT_HEIGHT, CORNER_RADIUS } from "../assets/constants";
import MagnifyingGlass from "../assets/magnifying-glass-solid.svg";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

interface InputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
}

const LocationSearchBar: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
}) => {
  return (
    <View style={styles.container}>
      <View
        style={{
          paddingLeft: 10,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <MagnifyingGlass
          height={20}
          width={20}
          style={{ color: theme.PLACEHOLDER }}
        />
      </View>
      <GooglePlacesAutocomplete
        placeholder={placeholder}
        onPress={() => {}}
        query={{
          key: process.env.EXPO_PUBLIC_GOOGLE_API,
          language: "en",
        }}
        fetchDetails={true}
        styles={{
          textInputContainer: {
            backgroundColor: "white",
            borderRadius: 10,
            width: "100%",
          },
          textInput: {
            height: 38,
            color: "#5d5d5d",
            fontSize: 16,
            fontFamily: "MontserratRegular",
            backgroundColor: "transparent",
          },
          predefinedPlacesDescription: {
            color: "#1faadb",
          },
          listView: {
            backgroundColor: "white",
            position: "absolute",
            top: 50,
            width: "100%",
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
    borderWidth: 1,
    borderColor: theme.PLACEHOLDER,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: CORNER_RADIUS,
  },
  textInput: {
    backgroundColor: "transparent",
    fontSize: 16,
    fontFamily: "MontserratRegular",
  },
});

export default LocationSearchBar;
