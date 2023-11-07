import { Dimensions } from "react-native";
export const HORIZONTAL_PADDING = 28;
export const HEADER_ICON_DIMENSION = 30;
export const CORNER_RADIUS = 10;

const ICON_GAP = 30;
const NUM_ICONS_PER_ROW = 2; // TODO: make this work with 3
export const EVENT_ICON_DIAMETER =
  (Dimensions.get("window").width - 2 * HORIZONTAL_PADDING - ICON_GAP) /
  NUM_ICONS_PER_ROW;

export const ACCESS_KEY = "z8VmrXJoH1PlbOdhoL2vyzV1AD1C_xdxPrz4IA7N2lM";
export const SECRET_KEY = "5JvPWJeOWloIQqqsnXQSOn_GTEFav9hXDYuiiqYLbkM";
