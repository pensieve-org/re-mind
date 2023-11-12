import React from "react";
import { View, StyleSheet } from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";
import { COMPONENT_HEIGHT, CORNER_RADIUS } from "../assets/constants";

interface AppleSignInProps {
  onPress: () => void;
}

const AppleSignIn: React.FC<AppleSignInProps> = ({ onPress }) => {
  return (
    <View style={styles.container}>
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE}
        cornerRadius={CORNER_RADIUS}
        style={styles.appleLogin}
        onPress={onPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 10,
  },
  appleLogin: {
    width: "100%",
    height: COMPONENT_HEIGHT,
    justifyContent: "center",
    paddingVertical: 10,
  },
});

export default AppleSignIn;
