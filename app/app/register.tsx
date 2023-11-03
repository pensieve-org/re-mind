import React, { useState } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { router } from "expo-router";
import Header from "../components/Header";
import Body from "../components/Body";
import Input from "../components/Input";
import Button from "../components/Button";
import LoginValidation from "../services/auth.login";
import Alert from "../components/Alert";
import theme from "../assets/theme";
import { HORIZONTAL_PADDING, HEADER_ICON_DIMENSION } from "../assets/constants";
import Subtitle from "../components/Subtitle";
import registerUser from "../services/auth.register";
import BackArrow from "../assets/arrow-left.svg";

// TODO: Use Formik
const Register = () => {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      // TODO: Use Alert component instead
      alert("Passwords do not match");
      return;
    }

    try {
      setIsLoading(true);
      await registerUser({ email, password });
      setIsLoading(false);
      // TODO: Use Alert component instead, add a wait. Add loading animation.
      alert("User registered successfully");
      router.replace("login");
    } catch (error) {
      alert(error.message);
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
          <Subtitle>register</Subtitle>
        </View>
        <Input
          placeholder="enter name"
          label="name"
          value={name}
          onChangeText={setName}
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
      </View>
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
    alignItems: "flex-start",
    marginHorizontal: HORIZONTAL_PADDING,
  },
  alertContainer: {
    alignItems: "center",
    height: 80,
  },
});
