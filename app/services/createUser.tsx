import { db } from "../firebase.js";
import { doc, setDoc } from "firebase/firestore";

const createEvent = async (userDetails: UserDetails) => {
  try {
    await setDoc(doc(db, "users", userDetails.userId), userDetails);
  } catch (error) {
    throw error;
  }
};

export default createEvent;
