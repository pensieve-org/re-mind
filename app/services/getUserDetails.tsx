import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.js";

type User = {
  userId: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  events: any[]; // TODO: define event type
  friends: string[]; // TODO: define friend type
  friendRequests: string[]; // TODO: define friend request type
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
