import axios from "axios";
import { API_BASE_URL, API_DELETE_EVENT } from "../assets/constants";

const deleteEvent = async (eventId) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}${API_DELETE_EVENT}${eventId}`
    );
    return response;
  } catch (error) {
    console.error("Error removing friend:", error);
    throw error;
  }
};

export default deleteEvent;
