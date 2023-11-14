import axios from "axios";
import { API_APPLE_LOGIN, API_BASE_URL } from "../assets/constants";

const appleLogin = async (credentials) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}${API_APPLE_LOGIN}`,
      credentials
    );
    const user = response.data;
    return user;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

export default appleLogin;
