import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const uploadImageAsync = async (uri, filepath = null) => {
  const response = await fetch(uri);
  const blob = await response.blob();

  const storageRef = ref(getStorage(), filepath);
  await uploadBytes(storageRef, blob);

  return await getDownloadURL(storageRef);
};
