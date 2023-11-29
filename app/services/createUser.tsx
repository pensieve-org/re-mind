import { db } from "../firebase.js";
import { doc, setDoc } from "firebase/firestore";

const createEvent = async (userDetails: User) => {
  try {
    await setDoc(doc(db, "users", userDetails.userId), userDetails);
  } catch (error) {
    throw error;
  }
};

export default createEvent;
