import axios from "axios";
import { API_BASE_URL, API_GET_FRIENDS } from "../assets/constants";

const getFriends = async (userId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}${API_GET_FRIENDS}${userId}`
    );
    const friends = response.data;
    return friends;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

export default getFriends;
