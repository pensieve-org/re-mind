import axios from "axios";

const LoginValidation = async (email, password) => {
  try {
    const response = await axios.post("https://reqres.in/api/login", {
      email: email,
      password: password,
    });

    if (response.data.token) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

export default LoginValidation;
