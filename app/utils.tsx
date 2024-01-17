import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase.js";
import { AppState } from "react-native";
import * as MediaLibrary from "expo-media-library";
import uploadImagesToEvent from "./apis/uploadImagesToEvent";
import getUserEventsToUpload from "./apis/getUserEventsToUpload";
import clearEventUploadFlag from "./apis/clearEventUploadFlag";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const uploadImageAsync = async (uri, path) => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, blob);
    const URL = await getDownloadURL(storageRef);
    return URL;
  } catch (e) {
    console.error("Error in uploadImageAsync", e);
    throw e;
  }
};

export const handleImageUpload = async (batchSize: number = 5) => {
  const { status } = await MediaLibrary.requestPermissionsAsync();
  if (status !== "granted") return;

  if (AppState.currentState !== "active") return;

  const user = await AsyncStorage.getItem("@user");
  if (!user) return;

  const userJSON = JSON.parse(user) as UserDetails;
  const eventsToUpload = await getUserEventsToUpload(userJSON.userId);
  if (eventsToUpload.length === 0) return;

  for (const item of eventsToUpload) {
    const { iosImageIds, event } = item;

    try {
      const imageAssets = await MediaLibrary.getAssetsAsync({
        first: 100,
        mediaType: "photo",
        createdAfter: event.startTime.toMillis(),
        createdBefore: event.endTime.toMillis(),
      });

      const imagesToUpload = imageAssets.assets.filter(
        (image) =>
          image.filename.includes("IMG") &&
          !iosImageIds.includes(image.filename)
      );

      await uploadImagesToEvent(imagesToUpload, event.eventId, batchSize);

      if (event.status === "past") {
        await clearEventUploadFlag(event.eventId);
      }
    } catch (error) {
      alert(error);
    }
  }
};
