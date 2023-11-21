import axios from "axios";
import { API_BASE_URL, API_CHECK_USER } from "../assets/constants";

interface ValidateUserRequest {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

const checkUser = async (validateUserRequest: ValidateUserRequest) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}${API_CHECK_USER}`,
      validateUserRequest
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

export default checkUser;
