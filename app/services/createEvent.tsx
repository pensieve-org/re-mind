import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase.js";
import { uploadImageAsync } from "../utils";

const createEvent = async (eventDetails: Omit<EventDetails, "eventId">) => {
  try {
    const docRef = await addDoc(collection(db, "events"), {
      ...eventDetails,
      thumbnail: null,
    });

    await updateDoc(docRef, { eventId: docRef.id });

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
