import { writeBatch, collection, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.js";
import { uploadImageAsync } from "../utils";
import { Asset } from "expo-media-library";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import * as FileSystem from "expo-file-system";

const processImage = async (uri) => {
  const manipResult = await manipulateAsync(uri, [{ resize: { width: 500 } }], {
    compress: 0,
    format: SaveFormat.JPEG,
  });
  return manipResult.uri;
};

const uploadImagesToEvent = async (
  images: Asset[],
  eventId: string,
  batchSize: number = 5
) => {
  try {
    const eventRef = doc(db, "events", eventId);
    const docSnapshot = await getDoc(eventRef);
    if (docSnapshot.exists()) {
      let batch = writeBatch(db);
      let batchCount = 0;

      for (const image of images) {
        const fileInfo = await FileSystem.getInfoAsync(image.uri);
        if (!fileInfo.exists) {
          console.warn(`File does not exist at uri: ${image.uri}`);
          continue;
        }
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

        batchCount++;

        if (batchCount >= batchSize) {
          await batch.commit();
          batch = writeBatch(db); // Create a new batch
          batchCount = 0;
        }
      }

      if (batchCount > 0) {
        await batch.commit(); // Commit the remaining operations in the batch
      }
    }
  } catch (error) {
    console.error("Error uploading images:", error);
    throw error;
  }
};

export default uploadImagesToEvent;
