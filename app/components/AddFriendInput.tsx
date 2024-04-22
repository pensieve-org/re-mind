import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { TextInput as PaperTextInput } from "react-native-paper";
import Body from "./Body";
import theme from "../assets/theme";
import { COMPONENT_HEIGHT, CORNER_RADIUS } from "../assets/constants";
import AddFriendIcon from "../assets/add-friend.svg";
import { TouchableOpacity } from "react-native-gesture-handler";

interface InputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onBlur?: Function;
  error?: boolean;
  onPress?: () => void;
}

const AddFriend: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  onBlur,
  error = false,
  onPress = () => {},
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
      <TouchableOpacity onPress={onPress}>
        <AddFriendIcon
          height={20}
          width={20}
          style={{ color: theme.PRIMARY }}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    width: "100%",
    height: COMPONENT_HEIGHT,
    borderWidth: 1,
    borderColor: theme.PRIMARY,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: CORNER_RADIUS,
  },
  textInput: {
    backgroundColor: "transparent",
    width: "90%",
    paddingLeft: 8,
    fontSize: 16,
    fontFamily: "MontserratRegular",
  },
});

export default AddFriend;
