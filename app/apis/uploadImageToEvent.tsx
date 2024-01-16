import { writeBatch, collection, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.js";
import { uploadImageAsync } from "../utils";
import { Asset } from "expo-media-library";

const uploadImageToEvent = async (image: Asset, eventId: string) => {
  try {
    const batch = writeBatch(db);
    const eventRef = doc(db, "events", eventId);

    const docSnapshot = await getDoc(eventRef);
    if (docSnapshot.exists()) {
      const url = await uploadImageAsync(image.uri, `images/${image.uri}`);
      const imagesRef = collection(eventRef, "images");
      const newImageRef = doc(imagesRef);
      batch.set(newImageRef, {
        imageId: newImageRef.id,
        imageUrl: url,
        queued: false,
        tagged: "",
        uploadTime: Date.now(),
        iosImageId: image.filename,
      });
    }
    await batch.commit();
  } catch (error) {
    console.error("Error uploading images:", error);
    throw error;
  }
};

export default uploadImageToEvent;
