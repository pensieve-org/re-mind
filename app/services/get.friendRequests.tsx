import axios from "axios";
import { API_BASE_URL, API_GET_FRIEND_REQUESTS } from "../assets/constants";

const getFriendRequests = async (userId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}${API_GET_FRIEND_REQUESTS}${userId}`
    );
    const friends = response.data;
    return friends;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

export default getFriendRequests;
