import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase.js";

const removeFriend = async (userId, friendId) => {
  try {
    let q = query(
      collection(db, "friends"),
      where("user1Id", "==", userId),
      where("user2Id", "==", friendId)
    );
    let querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docId = querySnapshot.docs[0].id;
      await deleteDoc(doc(db, "friends", docId));
      return;
    }

    // Query where user1Id equals friendId and user2Id equals userId
    q = query(
      collection(db, "friends"),
      where("user1Id", "==", friendId),
      where("user2Id", "==", userId)
    );
    querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docId = querySnapshot.docs[0].id;
      await deleteDoc(doc(db, "friends", docId));
      return;
    }

    throw new Error("No friendship found");
  } catch (error) {
    console.error("Error removing friend: ", error);
    throw error;
  }
};

export default removeFriend;
