import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase.js";

const getEventImages = async (eventId: string): Promise<ImageDetails[]> => {
  try {
    const eventRef = doc(db, "events", eventId);
    const eventDoc = await getDoc(eventRef);

    if (!eventDoc.exists()) {
      throw new Error("Event does not exist");
    }

    const imagesRef = collection(eventRef, "images");
    const imagesSnapshot = await getDocs(imagesRef);
    const images = imagesSnapshot.docs.map((doc) => doc.data() as ImageDetails);

    return images;
  } catch (error) {
    console.error("Error getting event images: ", error);
    throw error;
  }
};

export default getEventImages;
