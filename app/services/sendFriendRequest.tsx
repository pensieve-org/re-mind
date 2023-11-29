import {
  doc,
  getDoc,
  addDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase.js";

const sendFriendRequest = async (userId, friendUsername) => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      throw new Error("User not found");
    }

    const usersRef = collection(db, "users");
    let q = query(usersRef, where("username", "==", friendUsername));

    let querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error("Friend not found");
    }

    const friendId = querySnapshot.docs[0].data().userId;

    // Query where user1Id equals userId
    q = query(
      collection(db, "friends"),
      where("user1Id", "==", userId),
      where("user2Id", "==", friendId)
    );
    querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      throw new Error("Users are already friends");
    }

    // Query where user1Id equals friendId and user2Id equals userId
    q = query(
      collection(db, "friends"),
      where("user1Id", "==", friendId),
      where("user2Id", "==", userId)
    );
    querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      throw new Error("Users are already friends");
    }

    // Create a new document in the attendees collection
    await addDoc(collection(db, "friends"), {
      user1Id: userId,
      user2Id: friendId,
      status: "requested" as FriendStatus,
    });
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
};

export default sendFriendRequest;
