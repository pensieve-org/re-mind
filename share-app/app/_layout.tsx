import { createContext, useState } from "react";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";

export const UserContext = createContext(null);

export default function HomeLayout() {
  const [name, setName] = useState("");
  const [profilePicture, setProfilePicture] = useState("");

  return (
    <UserContext.Provider
      value={{ name, setName, profilePicture, setProfilePicture }}
    >
      <Slot>
        <StatusBar style="light" />
      </Slot>
    </UserContext.Provider>
  );
}
