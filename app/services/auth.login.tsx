import axios from "axios";
import { API_BASE_URL, API_LOGIN } from "../assets/constants";

const login = async (identifier, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}${API_LOGIN}`, {
      identifier,
      password,
    });
    const user = response.data;
    return user;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

export default login;
