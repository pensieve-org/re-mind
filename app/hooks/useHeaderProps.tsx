import React from "react";
import { HeaderProps } from "../components/Header";
import BackArrow from "../assets/arrow-left.svg";
import { router } from "expo-router";
import theme from "../assets/theme";
import { HEADER_ICON_DIMENSION } from "../assets/constants";

const defaultHeaderProps: Partial<HeaderProps> = {
  onPressLeft: () => router.back(),
  imageLeft: (
    <BackArrow
      style={{
        width: HEADER_ICON_DIMENSION,
        height: HEADER_ICON_DIMENSION,
        color: theme.PRIMARY,
      }}
    />
  ),
};

export function useHeaderProps(overrides?: Partial<HeaderProps>) {
  return { ...defaultHeaderProps, ...overrides };
}
