import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { TextInput as PaperTextInput } from "react-native-paper";
import Body from "./Body";
import theme from "../assets/theme";

interface InputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onBlur?: Function;
  error?: boolean;
  type?: "text" | "password";
}

const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  onBlur,
  error = false,
  type = "text",
}) => {
  const [revealContent, setRevealContent] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const Label = (
    <Body
      style={[
        styles.textInput,
        { color: !isFocused ? theme.PLACEHOLDER : theme.TEXT },
      ]}
    >
      {label}
    </Body>
  );

  return (
    <View style={styles.container}>
      <PaperTextInput
        label={Label}
        testID="inputTest"
        mode="flat"
        placeholder={placeholder}
        placeholderTextColor={theme.PLACEHOLDER}
        onBlur={(event) => {
          setIsFocused(false);
          onBlur?.(event);
        }}
        onFocus={() => setIsFocused(true)}
        value={value}
        onChangeText={onChangeText}
        error={error}
        secureTextEntry={type === "password" && !revealContent}
        style={styles.textInput}
        textColor={theme.TEXT}
        theme={{
          colors: {
            primary: theme.TEXT,
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
    marginVertical: 8,
    width: "100%",
    height: 55,
    borderWidth: 1,
    borderColor: theme.PRIMARY,
    flexDirection: "row",
    alignItems: "center",
  },
  textInput: {
    backgroundColor: "transparent",
    width: "90%",
    paddingLeft: 8,
    fontFamily: "Montserrat",
    fontSize: 16,
    fontWeight: "400",
  },
});

export default Input;
