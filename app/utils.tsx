import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export async function uploadImageAsync(uri, filepath = null) {
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      console.log(e);
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });

  const fileRef = ref(getStorage(), `${filepath}`);
  const result = await uploadBytes(fileRef, blob);

  blob.close();

  return await getDownloadURL(fileRef);
}
