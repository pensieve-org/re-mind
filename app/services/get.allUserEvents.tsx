import axios from "axios";
import { API_BASE_URL, API_GET_ALL_USER_EVENTS } from "../assets/constants";

const getAllUserEvents = async (user_id) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}${API_GET_ALL_USER_EVENTS}${user_id}`
    );
    if (response.status !== 200) {
      throw new Error("Network response was not ok");
    }
    const events = response.data;
    return events;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

export default getAllUserEvents;
