import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.js";

type User = {
  userId: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
};

const getUserDetails = async (userId): Promise<User> => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      return userDoc.data() as User;
    } else {
      throw new Error("User does not exist");
    }
  } catch (error) {
    throw error;
  }
};

export default getUserDetails;
