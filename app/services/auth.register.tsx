import axios from "axios";
import { API_BASE_URL, API_REGISTER } from "../assets/constants";

interface RegisterRequest {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
}

const register = async (registerRequest: RegisterRequest) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}${API_REGISTER}`,
      registerRequest
    );
    const user = response.data;
    return user;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

export default register;
