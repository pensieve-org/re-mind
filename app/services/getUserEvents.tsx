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
    let numInvited = 0;

    // Query where eventId equals eventId
    const q = query(collection(db, "attendees"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const eventId = doc.data().eventId;
      const userType = doc.data().userType;
      eventDetails.push({ eventId, userType });
    });

    const live = [];
    const future = [];
    const past = [];

    for (const eventDetail of eventDetails) {
      const eventRef = doc(db, "events", eventDetail.eventId);
      const eventSnapshot = await getDoc(eventRef);

      if (eventSnapshot.exists()) {
        const event = {
          ...(eventSnapshot.data() as Event),
          isInvited: eventDetail.userType == "invited" ? true : false,
        };

        if (eventDetail.userType === "invited" && event.status === "future")
          numInvited++;

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
      }
    }

    return {
      live,
      future,
      past,
      numInvited,
    };
  } catch (error) {
    console.error("Error getting user events: ", error);
    throw error;
  }
};

export default getUserEvents;
