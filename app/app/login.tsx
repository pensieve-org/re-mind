import React, { useState, useContext } from "react";
import { StyleSheet, View } from "react-native";
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

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const { setName, setProfilePicture } = useContext(AppContext);

  const handleLogin = async () => {
    setError(false);
    // TODO: add a loading animation
    setIsLoading(true);
    const isValidlogin = await validateLogin(email, password);
    const userDetails = await getUserDetails(email);
    setIsLoading(false);
    if (isValidlogin) {
      setName(userDetails.first_name);
      setProfilePicture(userDetails.avatar);
      router.replace("/home");
    } else {
      setError(true);
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
        <View style={{ paddingVertical: 50, paddingTop: 30 }}>
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
});
