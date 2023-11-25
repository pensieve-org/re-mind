import axios from "axios";
import { API_BASE_URL, API_CREATE_EVENT } from "../assets/constants";

interface User {
  user_id: number;
  first_name: string;
  last_name: string;
  username?: string;
  email: string;
  profile_picture_url?: string;
  firebase_id: string;
}

interface CreateEventRequest {
  start_time: Date;
  end_time: Date;
  name: string;
  attendees?: User[];
  thumbnail?: string;
}

const createEvent = async (createEventRequest: CreateEventRequest) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}${API_CREATE_EVENT}`,
      createEventRequest
    );
    const event = response.data;
    return event;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

export default createEvent;
