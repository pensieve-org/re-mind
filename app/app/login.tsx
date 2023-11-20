import React, { useState, useContext } from "react";
import { ActivityIndicator, Platform, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import Header from "../components/Header";
import { AppContext } from "./_layout";
import Input from "../components/Input";
import Button from "../components/Button";
import getUser from "../services/get.user";
import Alert from "../components/Alert";
import theme from "../assets/theme";
import { HEADER_ICON_DIMENSION, HORIZONTAL_PADDING } from "../assets/constants";
import Subtitle from "../components/Subtitle";
import BackArrow from "../assets/arrow-left.svg";
import getAllUserEvents from "../services/get.allUserEvents";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  OAuthProvider,
  signInWithEmailAndPassword,
  signInWithCredential,
} from "firebase/auth";
import auth from "../firebase.js";
import * as AppleAuthentication from "expo-apple-authentication";
import Body from "../components/Body";
import AppleSignIn from "../components/AppleSignIn";
import "react-native-get-random-values";
import { nanoid } from "nanoid";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { setUserDetails, setUserEvents } = useContext(AppContext);

  const handleLogin = async () => {
    setError(false);
    setIsLoading(true);

    if (!email || !password) {
      setErrorMsg("Please enter an email and password");
      setError(true);
      setIsLoading(false);
      return;
    }

    try {
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = await getUser(userCredentials.user.uid);
      setUserDetails(user);
      await AsyncStorage.setItem("@user", JSON.stringify(user));
      setUserEvents(await getAllUserEvents(user.user_id));
      setIsLoading(false);
      router.replace("/home");
    } catch (error) {
      if (error.code === "auth/invalid-email") {
        setErrorMsg("invalid email address");
      } else if (error.code === "auth/invalid-login-credentials") {
        setErrorMsg("invalid login credentials");
      } else {
        setErrorMsg(error.code);
      }
      setError(true);
      setIsLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    // TODO: fix this
    setError(false);
    setIsLoading(true);

    try {
      const credentials = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      const provider = new OAuthProvider("apple.com");
      const appleCredential = provider.credential({
        idToken: credentials.identityToken,
        rawNonce: nanoid(),
      });

      const userCredential = await signInWithCredential(auth, appleCredential);
      const user = await getUser(userCredential.user.uid);
      setUserDetails(user);
      await AsyncStorage.setItem("@user", JSON.stringify(user));
      setUserEvents(await getAllUserEvents(user.user_id));
      setIsLoading(false);
      router.replace("/home");
    } catch (error) {
      if (error.code === "auth/invalid-email") {
        setErrorMsg("invalid email address");
      } else if (error.code === "auth/invalid-login-credentials") {
        setErrorMsg("invalid login credentials");
      } else {
        setErrorMsg(error.message);
      }
      setError(true);
      setIsLoading(false);
      console.log(error.message);
    }
  };

  const handleForgotPassword = () => {
    router.push("/forgot-password");
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
          placeholder="enter email"
          label="email"
          value={email}
          onChangeText={setEmail}
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

        <Body style={styles.forgotPassword} onPress={handleForgotPassword}>
          forgot password?
        </Body>

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
  forgotPassword: {
    width: "100%",
    textAlign: "right",
    marginVertical: 5,
  },
});
