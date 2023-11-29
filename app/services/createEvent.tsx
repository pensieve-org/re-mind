import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase.js";
import { uploadImageAsync } from "../utils";
import addUserToEvent from "./addUserToEvent";

const createEvent = async (
  eventDetails: Omit<EventDetails, "eventId">,
  attendees: UserDetails[],
  admin: UserDetails
) => {
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

    await addUserToEvent(admin.userId, docRef.id, "admin");

    for (const attendee of attendees) {
      await addUserToEvent(attendee.userId, docRef.id, "guest");
    }
  } catch (error) {
    throw error;
  }
};

export default createEvent;
