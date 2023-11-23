import axios from "axios";
import { API_BASE_URL, API_UPDATE_PROFILE_PICTURE } from "../assets/constants";

const updateProfilePicture = async (
  userId: number,
  profilePictureUrl: string
) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}${API_UPDATE_PROFILE_PICTURE}${userId}`,
      { profile_picture_url: profilePictureUrl }
    );
    return response;
  } catch (error) {
    console.error("Error updating profile picture:", error);
    throw error;
  }
};

export default updateProfilePicture;
