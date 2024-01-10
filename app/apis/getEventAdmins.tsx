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

const getEventAdmins = async (eventId: string): Promise<UserDetails[]> => {
  try {
    const admins = [];

    // Query where eventId equals eventId
    const q = query(
      collection(db, "attendees"),
      where("eventId", "==", eventId)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const userId = doc.data().userId;
      const userType = doc.data().userType;

      if (userType === "admin") {
        admins.push(userId);
      }
    });

    // For each userId in admins, query the users collection and add the full user details to admins
    const userDetailsPromises = admins.map((adminId) =>
      getUserDetails(adminId)
    );
    const userDetails = await Promise.all(userDetailsPromises);

    return userDetails;
  } catch (error) {
    console.error("Error getting admin details: ", error);
    throw error;
  }
};

export default getEventAdmins;
