import axios from "axios";
import { API_BASE_URL, API_ADD_FRIEND } from "../assets/constants";

const addFriend = async (userId, friendUsername) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}${API_ADD_FRIEND}${userId}/${friendUsername}`
    );
    return response;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

export default addFriend;
