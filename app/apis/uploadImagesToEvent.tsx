import { writeBatch, collection, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.js";
import { uploadImageAsync } from "../utils";
import { Asset } from "expo-media-library";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";

const processImage = async (uri) => {
  const manipResult = await manipulateAsync(
    uri,
    [{ resize: { width: 1000 } }],
    { compress: 0, format: SaveFormat.JPEG }
  );
  return manipResult.uri;
};

const uploadImagesToEvent = async (images: Asset[], eventId: string) => {
  try {
    const batch = writeBatch(db);
    const eventRef = doc(db, "events", eventId);

    const docSnapshot = await getDoc(eventRef);
    if (docSnapshot.exists()) {
      for (const image of images) {
        const processedImage = await processImage(image.uri);
        const url = await uploadImageAsync(
          processedImage,
          `images/${processedImage}`
        );
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
    }
    await batch.commit();
  } catch (error) {
    console.error("Error uploading images:", error);
    throw error;
  }
};

export default uploadImagesToEvent;
