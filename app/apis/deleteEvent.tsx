import {
  collection,
  doc,
  getDocs,
  query,
  where,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";
import { db, storage } from "../firebase.js";
import { deleteObject, ref } from "firebase/storage";

const deleteEvent = async (eventId) => {
  try {
    // get imageIds to delete from storage
    const imagesCollectionRef = collection(db, `events/${eventId}/images`);
    const imagesSnapshot = await getDocs(imagesCollectionRef);
    const imageIds = imagesSnapshot.docs.map((doc) => doc.id);

    // delete event from firestore
    const eventRef = doc(db, "events", eventId);
    await deleteDoc(eventRef);

    // delete attendees from firestore
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

    // delete images from storage
    for (const imageId of imageIds) {
      const imageRef = ref(storage, `images/${imageId}`);
      try {
        await deleteObject(imageRef);
      } catch (err) {
        console.log(err);
      }
    }

    // delete thumbnail from storage if it exists
    const thumbnailRef = ref(storage, `events/${eventId}/thumbnail`);
    try {
      await deleteObject(thumbnailRef);
    } catch (err) {
      console.log(err);
    }
  } catch (error) {
    throw error;
  }
};

export default deleteEvent;
