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
import getEventImages from "./getEventImages";

const getUserEventsToUpload = async (userId) => {
  try {
    const eventIds = [];

    // Query where eventId equals eventId
    const q = query(collection(db, "attendees"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const eventId = doc.data().eventId;
      eventIds.push({ eventId });
    });

    const eventsToUpload = [];

    for (const eventId of eventIds) {
      const eventRef = doc(db, "events", eventId.eventId);
      const eventSnapshot = await getDoc(eventRef);

      if (eventSnapshot.exists()) {
        const event = eventSnapshot.data() as EventDetails;

        if (event.uploadFlag === true) {
          const images = await getEventImages(event.eventId);
          eventsToUpload.push({ event: event, images: images });
        }
      }
    }

    return eventsToUpload;
  } catch (error) {
    console.error("Error getting user events: ", error);
    throw error;
  }
};

export default getUserEventsToUpload;
