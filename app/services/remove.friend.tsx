import axios from "axios";
import { API_BASE_URL, API_REMOVE_FRIEND } from "../assets/constants";

const removeFriend = async (userId, friendId) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}${API_REMOVE_FRIEND}${userId}/${friendId}`
    );
    return response;
  } catch (error) {
    console.error("Error removing friend:", error);
    throw error;
  }
};

export default removeFriend;
