import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase.js";

const updateThumbnail = async (eventId: string, thumbnail: string) => {
  try {
    const docRef = doc(db, "events", eventId);
    await updateDoc(docRef, { thumbnail: thumbnail });
  } catch (error) {
    throw error;
  }
};

export default updateThumbnail;
