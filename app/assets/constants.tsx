import { Dimensions } from "react-native";
export const HORIZONTAL_PADDING = 28;
export const HEADER_ICON_DIMENSION = 30;
export const CORNER_RADIUS = 10;
export const COMPONENT_HEIGHT = 55;

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

// TODO: replace localhost with computer ip (127.0.0.1), should work with expo app then
export const API_BASE_URL = "http://localhost:8000/";
export const API_GET_ALL_USER_EVENTS = "get_all_user_events/";
export const API_GET_EVENT = "get_event/";
export const API_APPLE_LOGIN = "apple_login/";
