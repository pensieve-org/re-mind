import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase.js";

const clearEventUploadFlag = async (eventId) => {
  try {
    const eventRef = doc(db, "events", eventId);
    await updateDoc(eventRef, {
      uploadFlag: false,
    });
  } catch (error) {
    console.error("Error updating document: ", error);
    throw error;
  }
};

export default clearEventUploadFlag;
