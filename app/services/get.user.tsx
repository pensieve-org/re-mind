import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.js";

const getUser = async (userId) => {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data();
  } else {
    throw new Error(`No user found for ID: ${userId}`);
  }
};

export default getUser;
