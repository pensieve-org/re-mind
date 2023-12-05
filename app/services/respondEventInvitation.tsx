import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase.js";

const respondEventInvitation = async (
  response: boolean,
  eventId: string,
  userId: string
) => {
  try {
    const q = query(
      collection(db, "attendees"),
      where("eventId", "==", eventId),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const attendeeRef = querySnapshot.docs[0].ref;

      if (response) {
        // set the usertype to guest
        await setDoc(attendeeRef, { userType: "guest" }, { merge: true });
      } else {
        // delete the user event doc in attendees
        await deleteDoc(attendeeRef);
      }
    } else {
      console.log("No matching document");
    }
  } catch (error) {
    console.error("Error updating document: ", error);
    throw error;
  }
};

export default respondEventInvitation;
