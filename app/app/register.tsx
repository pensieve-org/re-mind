import React, { useContext, useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { router } from "expo-router";
import Header from "../components/Header";
import Input from "../components/Input";
import Button from "../components/Button";
import Alert from "../components/Alert";
import theme from "../assets/theme";
import { HORIZONTAL_PADDING, HEADER_ICON_DIMENSION } from "../assets/constants";
import Subtitle from "../components/Subtitle";
import BackArrow from "../assets/arrow-left.svg";
import { AppContext } from "./_layout";
import AsyncStorage from "@react-native-async-storage/async-storage";
import getAllUserEvents from "../services/get.allUserEvents";
import register from "../services/auth.register";

// TODO: Use Formik
const Register = () => {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { setUserDetails, userDetails, setUserEvents, setAppleCredentials } =
    useContext(AppContext);

  const handleRegister = async () => {
    setError(false);
    if (!password || !confirmPassword || !email || !firstName || !lastName) {
      setErrorMsg("fill out all fields");
      setError(true);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("passwords do not match");
      setError(true);
      return;
    }

    try {
      setIsLoading(true);
      const user = await register({
        email: email,
        username: username,
        first_name: firstName,
        last_name: lastName,
        password: password,
      });
      setIsLoading(false);
      setUserDetails(user);
      await AsyncStorage.setItem("@user", JSON.stringify(user));
      setUserEvents(await getAllUserEvents(userDetails.id));
      setIsLoading(false);
      router.replace("/home");
    } catch (error) {
      setErrorMsg(error.response.data.detail);
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

      {error && (
        <View style={styles.alertContainer}>
          <Alert text={errorMsg} />
        </View>
      )}

      <ScrollView style={styles.container}>
        <View style={{ paddingVertical: 50, paddingTop: 30 }}>
          <Subtitle>register</Subtitle>
        </View>
        <Input
          placeholder="enter first name"
          label="first name"
          value={firstName}
          onChangeText={setFirstName}
        />
        <Input
          placeholder="enter last name"
          label="last name"
          value={lastName}
          onChangeText={setLastName}
        />
        <Input
          placeholder="enter username"
          label="username"
          value={username}
          onChangeText={setUsername}
        />
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
        <Input
          placeholder="enter password"
          label="confirm password"
          type="password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <Button fill="white" textColor="black" onPress={handleRegister}>
          register
        </Button>
      </ScrollView>
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  page: {
    backgroundColor: theme.BACKGROUND,
    flex: 1,
  },
  container: {
    flex: 1,
    marginHorizontal: HORIZONTAL_PADDING,
  },
  alertContainer: {
    alignItems: "center",
    height: 80,
  },
});
