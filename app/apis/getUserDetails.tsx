import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.js";

const getUserDetails = async (userId): Promise<UserDetails> => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists() && userDoc.data()) {
      return userDoc.data() as UserDetails;
    } else {
      throw new Error("User does not exist or has no data");
    }
  } catch (error) {
    throw error;
  }
};

export default getUserDetails;
