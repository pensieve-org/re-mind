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

const getEventAttendees = async (
  eventId: string,
  currentUserId: string
): Promise<UserDetails[]> => {
  try {
    const attendees = [];

    // Query where eventId equals eventId
    const q = query(
      collection(db, "attendees"),
      where("eventId", "==", eventId)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const userId = doc.data().userId;
      const userType = doc.data().userType;

      if (
        (userType === "admin" || userType === "guest") &&
        userId !== currentUserId
      ) {
        attendees.push(userId);
      }
    });

    // For each userId in attendees, query the users collection and add the full user details to attendees
    const userDetailsPromises = attendees.map((attendeeId) =>
      getUserDetails(attendeeId)
    );
    const userDetails = await Promise.all(userDetailsPromises);

    return userDetails;
  } catch (error) {
    console.error("Error getting attendee details: ", error);
    throw error;
  }
};

export default getEventAttendees;
