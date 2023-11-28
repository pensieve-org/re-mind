import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase.js";
import { uploadImageAsync } from "../utils";

interface CreateEventRequest {
  start_time: Date;
  end_time: Date;
  name: string;
  thumbnail?: string;
  is_live: boolean;
  attendees: string[];
  admins: string[];
  viewers: string[];
  images: string[];
}

const createEvent = async (eventDetails: CreateEventRequest) => {
  try {
    const docRef = await addDoc(collection(db, "events"), {
      ...eventDetails,
      thumbnail: null,
    });

    if (eventDetails.thumbnail) {
      try {
        const uploadUrl = await uploadImageAsync(
          eventDetails.thumbnail,
          `/events/${docRef.id}`
        );
        await updateDoc(docRef, { thumbnail: uploadUrl });
      } catch (e) {
        console.error("Error updating event thumbnail");
      }
    }
  } catch (error) {
    throw error;
  }
};

export default createEvent;
