import axios from "axios";
import { API_APPLE_LOGIN, API_BASE_URL } from "../assets/constants";

const appleLogin = async (credentials) => {
  try {
    const response = await axios.post(
      "http://localhost:8000/apple_login",
      credentials
    );
    if (response.status !== 200) {
      throw new Error("Network response was not ok");
    }
    const user = response.data;
    return user;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

export default appleLogin;
