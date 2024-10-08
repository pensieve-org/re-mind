import React, { useContext, useState } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import Alert from "../../../components/Alert";
import theme from "../../../assets/theme";
import { HORIZONTAL_PADDING } from "../../../assets/constants";
import Subtitle from "../../../components/Subtitle";
import { AppContext } from "../../_layout";
import AsyncStorage from "@react-native-async-storage/async-storage";
import getUserEvents from "../../../apis/getUserEvents";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../../../firebase.js";
import createUser from "../../../apis/createUser";
import GradientScrollView from "../../../components/GradientScrollView";

// TODO: Use React Hook Forms / formik
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
  const { setUserDetails, setUserEvents } = useContext(AppContext);

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

      const existingUsername = await getDocs(
        query(collection(db, "users"), where("username", "==", username))
      );

      if (!existingUsername.empty) {
        setErrorMsg("username already exists");
        setError(true);
        setIsLoading(false);
        return;
      }

      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user: UserDetails = {
        userId: userCredentials.user.uid,
        email: userCredentials.user.email,
        username: username,
        firstName: firstName,
        lastName: lastName,
        profilePicture: null,
      };

      await createUser(user);

      setUserDetails(user);
      await AsyncStorage.setItem("@user", JSON.stringify(user));

      setUserEvents(await getUserEvents(user.userId));
      setIsLoading(false);
      router.replace("/home");
    } catch (error) {
      if (error.code === "auth/weak-password") {
        setErrorMsg("password must be at least 6 characters");
      } else if (error.code === "auth/invalid-email") {
        setErrorMsg("invalid email address");
      } else if (error.code === "auth/invalid-login-credentials") {
        setErrorMsg("invalid login credentials");
      } else if (error.code === "auth/email-already-in-use") {
        setErrorMsg("email already in use");
      } else {
        setErrorMsg(error.message);
      }
      setError(true);
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.page}>
      {error && (
        <View style={styles.alertContainer}>
          <Alert text={errorMsg} />
        </View>
      )}

      <GradientScrollView style={styles.container}>
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
        {isLoading && (
          <ActivityIndicator
            style={styles.loading}
            size={"large"}
            color={theme.PRIMARY}
          />
        )}
      </GradientScrollView>
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
  loading: {
    width: "100%",
    justifyContent: "center",
    paddingTop: 30,
  },
});
