import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase.js";

const acceptFriendRequest = async (userId, friendId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      throw new Error("User not found");
    }

    const friendRef = doc(db, "users", friendId);
    const friendDoc = await getDoc(friendRef);

    if (!friendDoc.exists()) {
      throw new Error("Friend not found");
    }

    // Query where user1Id equals friendId and user2Id equals userId
    const q = query(
      collection(db, "friends"),
      where("user1Id", "==", friendId),
      where("user2Id", "==", userId),
      where("status", "==", "requested")
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error("No friend request found");
    }

    // Get the document ID of the friend request
    const friendRequestId = querySnapshot.docs[0].id;

    // Get a reference to the friend request document
    const friendRequestRef = doc(db, "friends", friendRequestId);

    // Update the status of the friend request to "accepted"
    await updateDoc(friendRequestRef, {
      status: "accepted",
    });
  } catch (error) {
    console.error("Error accepting friend request: ", error);
    throw error;
  }
};

export default acceptFriendRequest;
