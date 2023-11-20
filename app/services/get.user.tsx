import axios from "axios";
import { API_BASE_URL, API_GET_USER } from "../assets/constants";

const getUser = async (firebaseId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}${API_GET_USER}${firebaseId}`
    );
    const user = response.data;
    return user;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

export default getUser;
