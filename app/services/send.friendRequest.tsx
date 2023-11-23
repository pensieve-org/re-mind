import axios from "axios";
import { API_BASE_URL, API_SEND_FRIEND_REQUEST } from "../assets/constants";

const sendFriendRequest = async (userId, friendUsername) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}${API_SEND_FRIEND_REQUEST}${userId}/${friendUsername}`
    );
    return response;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

export default sendFriendRequest;
