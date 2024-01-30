import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase.js";

const updateThumbnail = async (eventId: string, thumbnail: string | null) => {
  try {
    const docRef = doc(db, "events", eventId);
    await updateDoc(docRef, { thumbnail });
  } catch (error) {
    throw error;
  }
};

export default updateThumbnail;
