import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase.js";

const getFriendRequests = async (userId: string) => {
  try {
    const requests = [];

    // Query where user2Id equals userId
    const q = query(collection(db, "friends"), where("user2Id", "==", userId));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const friendId = doc.data().user1Id;
      const status = doc.data().status;

      if (status === "requested") {
        requests.push(friendId);
      }
    });

    // For each friendId in requests, query the users collection and add the full user details to requests
    for (let i = 0; i < requests.length; i++) {
      const userRef = doc(db, "users", requests[i]);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists() && userDoc.data()) {
        requests[i] = userDoc.data();
      }
    }

    return requests;
  } catch (error) {
    console.error("Error getting friend details: ", error);
    throw error;
  }
};

export default getFriendRequests;
