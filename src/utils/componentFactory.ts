import { DEFAULT_TEXT_PROPERTIES } from "../constants/properties/textProperties";
import { DEFAULT_IMAGE_PROPERTIES } from "../constants/properties/imageProperties";
import type { Component } from "../types";

export function componentFactory(
  type: string,
  id: string,
  x: number,
  y: number,
  zIndex: number
): Component | null {
  switch (type) {
    case "textarea":
      return {
        ...DEFAULT_TEXT_PROPERTIES,
        id,
        type: "textarea",
        x,
        y,
        zIndex,
      };
    case "image":
      return {
        ...DEFAULT_IMAGE_PROPERTIES,
        id,
        type: "image",
        x,
        y,
        zIndex,
      };
    default:
      return null;
  }
}
