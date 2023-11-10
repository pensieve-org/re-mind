import React, { useState, useContext } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import Header from "../components/Header";
import { AppContext } from "./_layout";
import Input from "../components/Input";
import Button from "../components/Button";
import validateLogin from "../services/auth.login";
import Alert from "../components/Alert";
import theme from "../assets/theme";
import { HEADER_ICON_DIMENSION, HORIZONTAL_PADDING } from "../assets/constants";
import Subtitle from "../components/Subtitle";
import { getUserDetails } from "../services/get.user";
import BackArrow from "../assets/arrow-left.svg";
import getAllUserEvents from "../services/get.allUserEvents";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const { setUserDetails, userDetails, setUserEvents } = useContext(AppContext);

  const handleLogin = async () => {
    setError(false);
    setIsLoading(true);
    const isValidlogin = await validateLogin(email, password);
    if (isValidlogin) {
      setUserDetails(await getUserDetails(email));
      setUserEvents(await getAllUserEvents(userDetails.id));
      setIsLoading(false);
      router.replace("/home");
    } else {
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
          />
        }
        onPressLeft={() => router.back()}
      />

      <View style={styles.alertContainer}>
        {error && <Alert text="Invalid email or password" />}
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
