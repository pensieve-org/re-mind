import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase.js";

const updateProfilePicture = async (userId: string, profilePicture: string) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { profilePicture: profilePicture });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    throw error;
  }
};

export default updateProfilePicture;
