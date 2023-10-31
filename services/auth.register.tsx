import axios from "axios";

interface RegisterUserRequest {
  email: string;
  password: string;
}

interface RegisterUserResponse {
  token: string;
}

// TODO: https://medium.com/@wanguiwawerub/user-registration-in-node-js-3e0ef7a61de7
async function registerUser(
  request: RegisterUserRequest
): Promise<RegisterUserResponse> {
  try {
    const response = await axios.post("https://reqres.in/api/users", request);
    return { token: response.data.token };
  } catch (error) {
    throw new Error("Failed to register user");
  }
}

export default registerUser;
