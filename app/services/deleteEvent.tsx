import {
  collection,
  doc,
  getDocs,
  query,
  where,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "../firebase.js";

const deleteEvent = async (eventId) => {
  try {
    const eventRef = doc(db, "events", eventId);
    await deleteDoc(eventRef);

    const attendeesQuery = query(
      collection(db, "attendees"),
      where("eventId", "==", eventId)
    );
    const attendeesSnapshot = await getDocs(attendeesQuery);

    const batchDelete = writeBatch(db);
    attendeesSnapshot.docs.forEach((doc) => {
      batchDelete.delete(doc.ref);
    });
    await batchDelete.commit();
  } catch (error) {
    throw error;
  }
};

export default deleteEvent;
