import {
  collection,
  doc,
  getDocs,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase.js";

const leaveEvent = async (eventId, userId) => {
  try {
    // delete attendee from firestore
    const attendeesQuery = query(
      collection(db, "attendees"),
      where("eventId", "==", eventId),
      where("userId", "==", userId)
    );
    const attendeesSnapshot = await getDocs(attendeesQuery);

    if (!attendeesSnapshot.empty) {
      const docRef = doc(db, "attendees", attendeesSnapshot.docs[0].id);
      await deleteDoc(docRef);
    }
  } catch (error) {
    throw error;
  }
};

export default leaveEvent;
