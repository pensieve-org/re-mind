import {
  doc,
  getDoc,
  addDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase.js";

const addUserToEvent = async (userId, eventId, userType: UserType) => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      throw new Error("User not found");
    }

    const eventRef = doc(db, "events", eventId);
    const eventDoc = await getDoc(eventRef);

    if (!eventDoc.exists()) {
      throw new Error("Event not found");
    }

    // Check if user is already attending the event
    const attendeesRef = collection(db, "attendees");
    const q = query(
      attendeesRef,
      where("userId", "==", userId),
      where("eventId", "==", eventId)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      throw new Error("User is already attending this event");
    }

    // Create a new document in the attendees collection
    await addDoc(attendeesRef, {
      userId: userId,
      eventId: eventId,
      userType: userType,
    });
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
};

export default addUserToEvent;
