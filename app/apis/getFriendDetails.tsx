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

const getFriendDetails = async (userId: string): Promise<UserDetails[]> => {
  try {
    const friends = [];

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
      }
    });

    // For each friendId in friends, query the users collection and add the full user details to friends
    const userDetailsPromises = friends.map((friendId) =>
      getUserDetails(friendId)
    );
    const userDetails = await Promise.all(userDetailsPromises);

    return userDetails;
  } catch (error) {
    console.error("Error getting friend details: ", error);
    throw error;
  }
};

export default getFriendDetails;
