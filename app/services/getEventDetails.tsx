import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.js";

type Event = {
  startTime: Date;
  endTime: Date;
  name: string;
  thumbnail: string;
  images: string[];
  status: "live" | "past" | "future";
  attendees: string[];
};

const getEventDetails = async (eventId): Promise<Event> => {
  try {
    const eventRef = doc(db, "events", eventId);
    const eventDoc = await getDoc(eventRef);

    if (eventDoc.exists()) {
      return eventDoc.data() as Event;
    } else {
      throw new Error("User does not exist");
    }
  } catch (error) {
    throw error;
  }
};

export default getEventDetails;
