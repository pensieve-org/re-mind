import React, { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";
import { sendPasswordResetEmail } from "firebase/auth";
import { router } from "expo-router";

import AlertBanner from "../../../components/Alert";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import Subtitle from "../../../components/Subtitle";

import { auth } from "../../../firebase.js";
import theme from "../../../assets/theme";

import { HORIZONTAL_PADDING } from "../../../assets/constants";

export default function Login() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleResetPassword = async () => {
    setError(false);
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setIsLoading(false);
      Alert.alert(
        "Password Reset Link Sent",
        "A link to reset your password has been sent to provided email",
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch (error) {
      if (error.code === "auth/invalid-email") {
        setErrorMsg("invalid email address");
      } else if (error.code === "auth/missing-email") {
        setErrorMsg("no email address provided");
      } else {
        setErrorMsg(error.code);
      }
      setError(true);
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.page}>
      <View style={styles.alertContainer}>
        {error && <AlertBanner text={errorMsg} />}
      </View>

      <View style={styles.container}>
        <View style={styles.subtitle}>
          <Subtitle>reset password</Subtitle>
        </View>

        <Input
          placeholder="enter email"
          label="email"
          value={email}
          onChangeText={setEmail}
        />
        <Button
          fill={theme.TEXT}
          textColor={theme.BACKGROUND}
          onPress={handleResetPassword}
        >
          send password reset link
        </Button>

        {isLoading && (
          <ActivityIndicator
            style={styles.loading}
            size={"large"}
            color={theme.PRIMARY}
          />
        )}
      </View>
    </View>
  );
}
// hello

const styles = StyleSheet.create({
  page: {
    backgroundColor: theme.BACKGROUND,
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: "flex-start",
    marginHorizontal: HORIZONTAL_PADDING,
  },
  alertContainer: {
    alignItems: "center",
    height: 80,
  },
  loading: {
    width: "100%",
    justifyContent: "center",
    paddingTop: 30,
  },
  subtitle: {
    paddingVertical: 50,
    paddingTop: 30,
  },
});
