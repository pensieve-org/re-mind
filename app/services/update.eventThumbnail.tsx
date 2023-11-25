import axios from "axios";
import { API_BASE_URL, API_UPDATE_EVENT_THUMBNAIL } from "../assets/constants";

const updateEventThumbnail = async (eventId: number, thumbnail: string) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}${API_UPDATE_EVENT_THUMBNAIL}${eventId}`,
      { thumbnail: thumbnail }
    );
    return response;
  } catch (error) {
    console.error("Error updating profile picture:", error);
    throw error;
  }
};

export default updateEventThumbnail;
