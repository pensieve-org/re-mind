import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";

const getFriendDetails = async (userId: string) => {
  try {
    const q = query(
      collection(db, "friends"),
      where("users", "array-contains", userId)
    );
    const querySnapshot = await getDocs(q);

    const friendIds = [];
    querySnapshot.forEach((doc) => {
      const friendData = doc.data();
      const otherUserId = friendData.users.find((id: string) => id !== userId);
      friendIds.push(otherUserId);
    });

    const friends = [];
    for (const id of friendIds) {
      const userRef = doc(db, "users", id);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        friends.push(userDoc.data());
      }
    }

    return friends;
  } catch (error) {
    console.error("Error getting friend details: ", error);
    throw error;
  }
};

export default getFriendDetails;
