import axios from "axios";
import { API_BASE_URL, API_LOGIN } from "../assets/constants";

const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}${API_LOGIN}`, {
      email: email,
      password: password,
    });

    if (response.data) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

export default login;
