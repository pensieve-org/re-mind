import axios from "axios";
import { ACCESS_KEY } from "../assets/constants";

const getSelectedEvent = async (number = 10) => {
  try {
    const response = await axios.get("https://api.unsplash.com/photos/random", {
      params: {
        count: number,
        client_id: ACCESS_KEY,
      },
    });
    if (response.status !== 200) {
      throw new Error("Network response was not ok");
    }
    const images = response.data.map((image) => image.urls.regular);
    return images;
  } catch (error) {
    console.error("Error fetching images:", error);
    throw error;
  }
};

export default getSelectedEvent;
