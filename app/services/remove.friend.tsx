import axios from "axios";
import { API_BASE_URL, API_REMOVE_FRIEND } from "../assets/constants";

const getFriends = async (userId, friendId) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}${API_REMOVE_FRIEND}${userId}/${friendId}`
    );
    return response;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

export default getFriends;
