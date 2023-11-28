import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase.js";

const updateProfilePicture = async (userId: string, profilePicture: string) => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, { profilePicture: profilePicture });
};

export default updateProfilePicture;
