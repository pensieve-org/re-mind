import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase.js";
import getUserDetails from "./getUserDetails";

const getFriendRequests = async (userId: string): Promise<UserDetails[]> => {
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
    const userDetailsPromises = requests.map((friendId) =>
      getUserDetails(friendId)
    );
    const userDetails = await Promise.all(userDetailsPromises);

    return userDetails;
  } catch (error) {
    console.error("Error getting friend details: ", error);
    throw error;
  }
};

export default getFriendRequests;
