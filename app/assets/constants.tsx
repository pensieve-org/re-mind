import { Dimensions } from "react-native";
export const HORIZONTAL_PADDING = 28;
export const HEADER_ICON_DIMENSION = 30;
export const CORNER_RADIUS = 10;

export const ICON_GAP = 30;
export const ROW_ICONS = 2;
export const EVENT_ICON_DIAMETER =
  (Dimensions.get("window").width -
    2 * HORIZONTAL_PADDING -
    (ROW_ICONS - 1) * ICON_GAP) /
  ROW_ICONS;

export const ACCESS_KEY = "z8VmrXJoH1PlbOdhoL2vyzV1AD1C_xdxPrz4IA7N2lM";
export const SECRET_KEY = "5JvPWJeOWloIQqqsnXQSOn_GTEFav9hXDYuiiqYLbkM";
