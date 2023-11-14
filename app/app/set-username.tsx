import React, { useContext, useState } from "react";
import { StyleSheet, View } from "react-native";
import { router } from "expo-router";
import Header from "../components/Header";
import Input from "../components/Input";
import Button from "../components/Button";
import Alert from "../components/Alert";
import theme from "../assets/theme";
import { HORIZONTAL_PADDING } from "../assets/constants";
import Subtitle from "../components/Subtitle";
import { AppContext } from "./_layout";
import appleNewUser from "../services/auth.appleNewUser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import getAllUserEvents from "../services/get.allUserEvents";

// TODO: Use Formik
const SetUsername = () => {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { setUserDetails, userDetails, setUserEvents, appleCredentials } =
    useContext(AppContext);

  const handleSubmit = async () => {
    setError(false);
    setIsLoading(true);

    if (!username) {
      setErrorMsg("Please enter a username");
      setError(true);
      setIsLoading(false);
      return;
    }

    try {
      const user = await appleNewUser(appleCredentials, username);
      if (user) {
        setUserDetails(user);
        await AsyncStorage.setItem("@user", JSON.stringify(user));
        setUserEvents(await getAllUserEvents(userDetails.id));
        setIsLoading(false);
        router.replace("/home");
      }
    } catch (error) {
      // Check if the error is due to the username being already taken
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.detail === "Username already taken"
      ) {
        setErrorMsg("Username already taken");
      } else {
        // Handle other types of errors
        setErrorMsg("An error occurred. Please try again.");
      }
      setError(true);
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.page}>
      <Header />
      <View style={styles.alertContainer}>
        {error && <Alert text={errorMsg} />}
      </View>

      <View style={styles.container}>
        <View style={{ paddingVertical: 50, paddingTop: 30 }}>
          <Subtitle>set username</Subtitle>
        </View>
        <Input
          placeholder="enter username"
          label="username"
          value={username}
          onChangeText={setUsername}
        />
        <Button fill="white" textColor="black" onPress={handleSubmit}>
          submit
        </Button>
      </View>
    </View>
  );
};

export default SetUsername;

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
