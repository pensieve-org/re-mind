import React from "react";
import { StyleSheet, View } from "react-native";
import { TextInput as PaperTextInput } from "react-native-paper";
import Body from "./Body";
import theme from "../assets/theme";
import { COMPONENT_HEIGHT, CORNER_RADIUS } from "../assets/constants";
import MagnifyingGlass from "../assets/magnifying-glass-solid.svg";

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
  const Label = (
    <Body style={[styles.textInput, { color: theme.PLACEHOLDER }]}>
      {label}
    </Body>
  );

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
      <PaperTextInput
        label={Label}
        mode="flat"
        placeholder={placeholder}
        placeholderTextColor={theme.PLACEHOLDER}
        value={value}
        onChangeText={onChangeText}
        style={styles.textInput}
        textColor={theme.BACKGROUND}
        theme={{
          colors: {
            primary: theme.BACKGROUND,
            secondary: theme.PLACEHOLDER,
            error: theme.ERROR_TEXT,
          },
        }}
        underlineStyle={{ display: "none" }}
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
