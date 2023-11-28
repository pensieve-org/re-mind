import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.js";

const getFriendRequests = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.friendRequests;
    } else {
      throw new Error("User does not exist");
    }
  } catch (error) {
    throw error;
  }
};

export default getFriendRequests;
