import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase.js";

const getUserEvents = async (userId) => {
  try {
    const eventDetails = [];

    // Query where eventId equals eventId
    const q = query(collection(db, "attendees"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const eventId = doc.data().eventId;
      const userType = doc.data().userType;
      eventDetails.push({ eventId, userType });
    });

    const events = [];

    for (const eventDetail of eventDetails) {
      const eventRef = doc(db, "events", eventDetail.eventId);
      const eventSnapshot = await getDoc(eventRef);

      if (eventSnapshot.exists()) {
        events.push({
          ...(eventSnapshot.data() as Event),
          isInvited: eventDetail.userType == "invited" ? true : false,
        });
      }
    }

    return events;
  } catch (error) {
    console.error("Error getting user events: ", error);
    throw error;
  }
};

export default getUserEvents;
