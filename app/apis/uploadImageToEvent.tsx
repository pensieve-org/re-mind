import { writeBatch, collection, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.js";
import { uploadImageAsync } from "../utils";

const uploadImageToEvent = async (
  imageUrl: string,
  iosImageId: string,
  eventId: string
) => {
  try {
    const batch = writeBatch(db);
    const eventRef = doc(db, "events", eventId);

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
        iosImageId: iosImageId,
      });
    }
    await batch.commit();
  } catch (error) {
    console.error("Error uploading images:", error);
    throw error;
  }
};

export default uploadImageToEvent;
