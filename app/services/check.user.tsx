import axios from "axios";
import { API_BASE_URL, API_CHECK_USER } from "../assets/constants";

const checkUser = async (email: string, username: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}${API_CHECK_USER}`, {
      params: { email, username },
    });
    return response.data;
  } catch (error) {
    console.error("Error checking user:", error);
    throw error;
  }
};

export default checkUser;
