import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.js";

const getEventDetails = async (eventId): Promise<EventDetails> => {
  try {
    const eventRef = doc(db, "events", eventId);
    const eventDoc = await getDoc(eventRef);

    if (eventDoc.exists() && eventDoc.data()) {
      return eventDoc.data() as EventDetails;
    } else {
      throw new Error("Event does not exist or has no data");
    }
  } catch (error) {
    throw error;
  }
};

export default getEventDetails;
