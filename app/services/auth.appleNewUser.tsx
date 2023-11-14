import axios from "axios";
import { API_APPLE_NEW_USER, API_BASE_URL } from "../assets/constants";

const appleNewUser = async (credentials, username) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}${API_APPLE_NEW_USER}?username=${username}`,
      credentials
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

export default appleNewUser;
