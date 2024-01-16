import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase.js";

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
