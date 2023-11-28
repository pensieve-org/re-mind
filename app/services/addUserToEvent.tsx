import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase.js";

type AddUserToEventRequest = {
  eventId: string;
  userId: string;
  userType: "admin" | "attendee" | "viewer";
  joinedAt: Date;
};

const addUserToEvent = async (request: AddUserToEventRequest) => {
  try {
    const docRef = await addDoc(collection(db, "eventUsers"), request);
    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
};

export default addUserToEvent;
