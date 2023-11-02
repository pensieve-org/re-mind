import axios from "axios";
import { ACCESS_KEY } from "../assets/constants";

const fetchImage = async (number = 10) => {
  const response = await axios.get("https://api.unsplash.com/photos/random", {
    params: {
      count: number,
      client_id: ACCESS_KEY,
    },
  });
  if (response.status !== 200) {
    throw new Error("Network response was not ok");
  }
  const data = response.data;
  return data;
};

export default fetchImage;

// TODO: make a service to pull all the events related to the user via SQL
// TODO: then make a service to pull all the photos related to a specific event via SQL
