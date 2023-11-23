import axios from "axios";
import { API_BASE_URL, API_ACCEPT_FRIEND_REQUEST } from "../assets/constants";

const acceptFriendRequest = async (userId, friendId) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}${API_ACCEPT_FRIEND_REQUEST}${userId}/${friendId}`
    );
    return response;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

export default acceptFriendRequest;
