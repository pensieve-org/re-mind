import axios from "axios";

export const fetchUserDetails = async (email: string) => {
  const response1 = await axios.get(`https://reqres.in/api/users?page=1`);
  const response2 = await axios.get(`https://reqres.in/api/users?page=2`);
  const userDetails = response1.data.data
    .concat(response2.data.data)
    .find((user) => user.email === email);
  return userDetails;
};
