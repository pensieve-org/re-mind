import { Dimensions } from "react-native";
export const HORIZONTAL_PADDING = 28;
export const HEADER_ICON_DIMENSION = 30;
export const PROFILE_ICON_DIMENSION = 150;
export const CORNER_RADIUS = 10;
export const COMPONENT_HEIGHT = 55;

export const ANIMATION_DURATION = 400;
export const ANIMATION_ENTRY = "fadeIn";
export const ANIMATION_EXIT = "fadeOut";

export const FRIEND_ICON_GAP = 10;
export const FRIEND_ICON_GAP_BOTTOM = 10;
export const FRIEND_ROW_ICONS = 4;
export const FRIEND_ICON_DIAMETER =
  (Dimensions.get("window").width -
    2 * HORIZONTAL_PADDING -
    (FRIEND_ROW_ICONS - 1) * FRIEND_ICON_GAP) /
  FRIEND_ROW_ICONS;

// For Home Screen
export const ICON_GAP = 30;
export const ICON_GAP_BOTTOM = 10;
export const ROW_ICONS = 2;
export const EVENT_ICON_DIAMETER =
  (Dimensions.get("window").width -
    2 * HORIZONTAL_PADDING -
    (ROW_ICONS - 1) * ICON_GAP) /
  ROW_ICONS;

// For Event Screen
export const IMAGE_GAP = 5;
export const ROW_IMAGES = 3;
export const EVENT_IMAGE_WIDTH =
  (Dimensions.get("window").width -
    2 * HORIZONTAL_PADDING -
    (ROW_IMAGES - 1) * IMAGE_GAP) /
  ROW_IMAGES;

// Profile Screen
export const PROFILE_ICON_DIAMETER = 80;

export const API_BASE_URL = "https://sweet-rapidly-phoenix.ngrok-free.app/";
export const API_GET_ALL_USER_EVENTS = "get_all_user_events/";
export const API_GET_EVENT = "get_event/";
export const API_CREATE_USER = "create_user";
export const API_GET_USER = "get_user/";
export const API_GET_FRIENDS = "get_friends/";
export const API_GET_FRIEND_REQUESTS = "get_friend_requests/";
export const API_SEND_FRIEND_REQUEST = "send_friend_request/";
export const API_ACCEPT_FRIEND_REQUEST = "accept_friend_request/";
export const API_REJECT_FRIEND_REQUEST = "reject_friend_request/";
export const API_REMOVE_FRIEND = "remove_friend/";
export const API_CHECK_USER = "check_user";
export const API_UPDATE_PROFILE_PICTURE = "update_profile_picture/";
