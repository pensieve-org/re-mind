import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { db } from "../firebase.js";

const addUserToEvent = async (userId, eventId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      console.error("User not found");
      return;
    }

    await updateDoc(userRef, {
      events: arrayUnion(eventId),
    });
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
};

export default addUserToEvent;
