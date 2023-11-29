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
    const eventIds = [];

    // Query where eventId equals eventId
    const q = query(collection(db, "attendees"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const eventId = doc.data().eventId;
      eventIds.push(eventId);
    });

    const events = [];

    for (const eventId of eventIds) {
      const eventRef = doc(db, "events", eventId);
      const eventSnapshot = await getDoc(eventRef);

      if (eventSnapshot.exists()) {
        const event = eventSnapshot.data();
        const currentTime = new Date();
        const startTime = new Date(event.startTime.toDate()); // Ensure event.startTime is a Firestore Timestamp
        const endTime = new Date(event.endTime.toDate()); // Ensure event.endTime is a Firestore Timestamp

        let newStatus = "";

        if (currentTime < startTime) {
          newStatus = "future";
        } else if (currentTime >= startTime && currentTime <= endTime) {
          newStatus = "live";
        } else if (currentTime > endTime) {
          newStatus = "past";
        }

        if (newStatus && newStatus !== event.status) {
          await updateDoc(eventRef, { status: newStatus });
          event.status = newStatus; // Update local event object's status
        }

        events.push(event);
      }
    }

    const live = [];
    const future = [];
    const past = [];

    events.forEach((event) => {
      switch (event.status) {
        case "past":
          past.push(event);
          break;
        case "future":
          future.push(event);
          break;
        case "live":
          live.push(event);
          break;
        default:
          break;
      }
    });

    return {
      live,
      future,
      past,
    };
  } catch (error) {
    console.error("Error getting user events: ", error);
    throw error;
  }
};

export default getUserEvents;