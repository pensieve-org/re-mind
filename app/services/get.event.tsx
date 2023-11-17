import axios from "axios";
import { API_GET_EVENT, API_BASE_URL } from "../assets/constants";

const getEvent = async (eventId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}${API_GET_EVENT}${eventId}`
    );
    if (response.status !== 200) {
      throw new Error("Network response was not ok");
    }
    const event = response.data;
    return event;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

export default getEvent;
