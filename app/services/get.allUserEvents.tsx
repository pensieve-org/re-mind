import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase.js";

const getAllUserEvents = async (userId) => {
  const userEvents = await getDocs(
    query(
      collection(db, "events"),
      where("attendees", "array-contains", userId)
    )
  );

  const all = [];
  const live = [];
  const future = [];
  const past = [];

  for (const event of userEvents.docs) {
    const eventData = event.data();
    const eventRef = doc(db, "events", event.id);

    const now = new Date();
    const startTime = new Date(eventData.start_time);
    const endTime = new Date(eventData.end_time);

    let isLive = false;
    if (endTime >= now && startTime <= now) {
      isLive = true;
    }

    if (eventData.isLive !== isLive) {
      eventData.isLive = isLive;
      await updateDoc(eventRef, { isLive });
    }

    if (isLive) {
      live.push(eventData);
    } else if (startTime > now) {
      future.push(eventData);
    } else if (endTime < now) {
      past.push(eventData);
    }

    all.push(eventData);
  }

  return {
    all,
    live,
    future,
    past,
  };
};

export default getAllUserEvents;
