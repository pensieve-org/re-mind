import axios from "axios";

interface RegisterUserRequest {
  name: string;
  email: string;
  password: string;
}

interface RegisterUserResponse {
  token: string;
}

async function registerUser(
  request: RegisterUserRequest
): Promise<RegisterUserResponse> {
  try {
    const response = await axios.post(
      "https://reqres.in/api/register",
      request
    );
    return { token: response.data.token };
  } catch (error) {
    throw new Error("Failed to register user");
  }
}

export default registerUser;
