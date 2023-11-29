import { db } from "../firebase.js";
import { doc, setDoc } from "firebase/firestore";

interface CreateUserRequest {
  userId: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  events: any[]; // TODO: define event type
  friends: string[]; // TODO: define friend type
  friendRequests: string[]; // TODO: define friend request type
}

const createEvent = async (userDetails: CreateUserRequest) => {
  try {
    await setDoc(doc(db, "users", userDetails.userId), userDetails);
  } catch (error) {
    throw error;
  }
};

export default createEvent;
