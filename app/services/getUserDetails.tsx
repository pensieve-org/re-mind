import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.js";

const getUserDetails = async (userIds) => {
  try {
    if (!Array.isArray(userIds)) {
      const userRef = doc(db, "users", userIds);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        return userDoc.data();
      } else {
        throw new Error("User does not exist");
      }
    } else {
      const userDetails = [];

      for (const userId of userIds) {
        const userRef = doc(db, "users", userId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          userDetails.push(userDoc.data());
        }
      }

      return userDetails;
    }
  } catch (error) {
    throw error;
  }
};

export default getUserDetails;
