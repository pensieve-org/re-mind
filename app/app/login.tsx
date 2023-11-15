import React, { useState, useContext } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import Header from "../components/Header";
import { AppContext } from "./_layout";
import Input from "../components/Input";
import Button from "../components/Button";
import login from "../services/auth.login";
import Alert from "../components/Alert";
import theme from "../assets/theme";
import {
  HEADER_ICON_DIMENSION,
  HORIZONTAL_PADDING,
  IOS_CLIENT_ID,
} from "../assets/constants";
import Subtitle from "../components/Subtitle";
import BackArrow from "../assets/arrow-left.svg";
import getAllUserEvents from "../services/get.allUserEvents";
import * as AppleAuthentication from "expo-apple-authentication";
import Body from "../components/Body";
import AppleSignIn from "../components/AppleSignIn";
import appleLogin from "../services/auth.appleLogin";
import { Platform } from "react-native";

import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";

WebBrowser.maybeCompleteAuthSession();

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { setUserDetails, userDetails, setUserEvents, setAppleCredentials } =
    useContext(AppContext);

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: IOS_CLIENT_ID,
  });

  const handleLogin = async () => {
    setError(false);
    setIsLoading(true);

    if (!identifier || !password) {
      setErrorMsg("Please enter an email/username and password");
      setError(true);
      setIsLoading(false);
      return;
    }

    try {
      const user = await login(identifier, password);
      setUserDetails(user);
      await AsyncStorage.setItem("@user", JSON.stringify(user));
      setUserEvents(await getAllUserEvents(userDetails.id));
      setIsLoading(false);
      router.replace("/home");
    } catch (error) {
      setErrorMsg(error.response.data.detail);
      setError(true);
      setIsLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setError(false);
    setIsLoading(true);
    const credentials = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    try {
      const user = await appleLogin(credentials);
      setUserDetails(user);
      await AsyncStorage.setItem("@user", JSON.stringify(user));
      setUserEvents(await getAllUserEvents(userDetails.user_id));
      setIsLoading(false);
      router.replace("/home");
    } catch (error) {
      if (error.response.status === 404) {
        // User not found, redirect to set username
        setAppleCredentials(credentials);
        setIsLoading(false);
        router.push("/set-username");
      } else {
        // Handle other errors
        setErrorMsg(error.response.data.detail);
        setError(true);
        setIsLoading(false);
      }
    }
  };

  return (
    <View style={styles.page}>
      <Header
        imageLeft={
          <BackArrow
            height={HEADER_ICON_DIMENSION}
            width={HEADER_ICON_DIMENSION}
          />
        }
        onPressLeft={() => router.back()}
      />

      <View style={styles.alertContainer}>
        {error && <Alert text={errorMsg} />}
      </View>

      <View style={styles.container}>
        <View style={styles.subtitle}>
          <Subtitle>login</Subtitle>
        </View>

        <Input
          placeholder="enter username/email"
          label="username/email"
          value={identifier}
          onChangeText={setIdentifier}
        />
        <Input
          placeholder="enter password"
          label="password"
          type="password"
          value={password}
          onChangeText={setPassword}
        />
        <Button
          fill={theme.TEXT}
          textColor={theme.BACKGROUND}
          onPress={handleLogin}
        >
          login
        </Button>

        {Platform.OS === "ios" && (
          <>
            <Body
              style={{
                width: "100%",
                textAlign: "center",
                paddingVertical: 30,
              }}
            >
              or
            </Body>

            <AppleSignIn onPress={handleAppleSignIn} />
          </>
        )}

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
