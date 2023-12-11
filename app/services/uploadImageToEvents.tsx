import { writeBatch, collection, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.js";
import { uploadImageAsync } from "../utils";

const uploadImageToEvents = async (
  imageUrl: string,
  liveEventIds: string[]
) => {
  if (liveEventIds.length === 0) {
    return;
  }
  try {
    const batch = writeBatch(db);

    for (const liveEventId of liveEventIds) {
      const eventRef = doc(db, "events", liveEventId);

      const docSnapshot = await getDoc(eventRef);
      if (docSnapshot.exists()) {
        const url = await uploadImageAsync(imageUrl, `images/${imageUrl}`);
        const imagesRef = collection(eventRef, "images");
        const newImageRef = doc(imagesRef);
        batch.set(newImageRef, {
          imageId: newImageRef.id,
          imageUrl: url,
          queued: false,
          tagged: "",
          uploadTime: Date.now(),
        });
      }
    }

    await batch.commit();
  } catch (error) {
    console.error("Error uploading images:", error);
    throw error;
  }
};

export default uploadImageToEvents;