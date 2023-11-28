import React, { useContext, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  OAuthProvider,
  signInWithEmailAndPassword,
  signInWithCredential,
} from "firebase/auth";
import { router } from "expo-router";
import "react-native-get-random-values";
import { View as AnimatedView } from "react-native-animatable";

import Alert from "../../components/Alert";
import BackArrow from "../../assets/arrow-left.svg";
import Body from "../../components/Body";
import Button from "../../components/Button";
import Header from "../../components/Header";
import Input from "../../components/Input";
import Subtitle from "../../components/Subtitle";

import { AppContext } from "../_layout";

import auth from "../../firebase.js";
import getAllUserEvents from "../../services/get.allUserEvents";
import getUser from "../../services/get.user";

import theme from "../../assets/theme";

import {
  ANIMATION_DURATION,
  ANIMATION_ENTRY,
  ANIMATION_EXIT,
  HEADER_ICON_DIMENSION,
  HORIZONTAL_PADDING,
} from "../../assets/constants";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { setUserDetails, setUserEvents } = useContext(AppContext);
  const [animation, setAnimation] = useState(ANIMATION_ENTRY);

  const navigate = (route, replace = false) => {
    setAnimation(ANIMATION_EXIT);
    setTimeout(() => {
      replace ? router.replace(route) : router.push(route);
    }, ANIMATION_DURATION);
  };

  const navigateBack = () => {
    setAnimation(ANIMATION_EXIT);
    setTimeout(() => {
      router.back();
    }, ANIMATION_DURATION);
  };

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
      setUserEvents(await getAllUserEvents(user.userId));
      setIsLoading(false);
      navigate("/home", true);
    } catch (error) {
      if (error.code === "auth/invalid-email") {
        setErrorMsg("invalid email address");
      } else if (error.code === "auth/invalid-login-credentials") {
        setErrorMsg("invalid login credentials");
      } else {
        setErrorMsg(error.response.data.detail);
      }
      setError(true);
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.page}>
      <Header
        imageLeft={
          <BackArrow
            height={HEADER_ICON_DIMENSION}
            width={HEADER_ICON_DIMENSION}
            style={{ color: theme.PRIMARY }}
          />
        }
        onPressLeft={navigateBack}
      />
      <AnimatedView
        animation={animation}
        duration={ANIMATION_DURATION}
        style={styles.page}
      >
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

          <Body
            style={styles.forgotPassword}
            onPress={() => {
              navigate("/forgot-password");
            }}
          >
            forgot password?
          </Body>

          {isLoading && (
            <ActivityIndicator
              style={styles.loading}
              size={"large"}
              color={theme.PRIMARY}
            />
          )}
        </View>
      </AnimatedView>
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
