import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const uploadImageAsync = async (uri, path) => {
  let URL;
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(getStorage(), path);
    await uploadBytes(storageRef, blob);
    URL = await getDownloadURL(storageRef);
    return URL;
  } catch (e) {
    throw e;
  }
};
