import React, { useState } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { router } from "expo-router";
import Header from "../components/Header";
import Body from "../components/Body";
import Input from "../components/Input";
import Button from "../components/Button";
import LoginValidation from "../services/auth.login";
import Alert from "../components/Alert";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleLogin = async () => {
    setError(false);
    setIsLoading(true);
    const isValidlogin = await LoginValidation(email, password);
    setIsLoading(false);
    if (isValidlogin) {
      router.replace("home");
    } else {
      setError(true);
    }
  };

  return (
    <View style={{ backgroundColor: "#000", flex: 1 }}>
      <Header
        imageLeft={<Image source={require("../assets/arrow-left.png")} />}
        onPressLeft={() => router.replace("/")}
      />

      <View style={styles.alertContainer}>
        {error && <Alert text="Invalid email or password" />}
      </View>

      <View style={styles.container}>
        <View style={{ paddingVertical: 50, paddingTop: 50 }}>
          <Body style={styles.subtitle} size={35}>
            login
          </Body>
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
        <Button fill="white" textColor="black" onPress={handleLogin}>
          login
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start",
    marginHorizontal: 28,
  },
  subtitle: {
    justifyContent: "flex-start",
    textAlign: "left",
    fontWeight: 600,
  },
  alertContainer: {
    alignItems: "center",
    height: 80,
  },
});
