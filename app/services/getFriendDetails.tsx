import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase.js";

// TODO: split this out into 2 functions

const getFriendDetails = async (userId: string) => {
  try {
    const friends = [];
    const requests = [];

    // Query where user1Id equals userId
    let q = query(collection(db, "friends"), where("user1Id", "==", userId));
    let querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const friendId = doc.data().user2Id;
      const status = doc.data().status;

      if (status === "accepted") {
        friends.push(friendId);
      }
    });

    // Query where user2Id equals userId
    q = query(collection(db, "friends"), where("user2Id", "==", userId));
    querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const friendId = doc.data().user1Id;
      const status = doc.data().status;

      if (status === "accepted") {
        friends.push(friendId);
      } else if (status === "requested") {
        requests.push(friendId);
      }
    });

    // For each friendId in friends, query the users collection and add the full user details to friends
    for (let i = 0; i < friends.length; i++) {
      const userRef = doc(db, "users", friends[i]);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists() && userDoc.data()) {
        friends[i] = userDoc.data();
      }
    }

    // For each friendId in requests, query the users collection and add the full user details to requests
    for (let i = 0; i < requests.length; i++) {
      const userRef = doc(db, "users", requests[i]);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists() && userDoc.data()) {
        requests[i] = userDoc.data();
      }
    }

    return { friends, requests };
  } catch (error) {
    console.error("Error getting friend details: ", error);
    throw error;
  }
};

export default getFriendDetails;
