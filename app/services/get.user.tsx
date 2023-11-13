import axios from "axios";
import { API_BASE_URL, API_GET_USER } from "../assets/constants";

export const getUserDetails = async (userId: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}${API_GET_USER}${userId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
