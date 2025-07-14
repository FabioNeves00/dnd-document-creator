import type { Component } from "../types";

export function componentFactory(
  type: string,
  id: string,
  x: number,
  y: number,
  zIndex: number
): Component | null {
  switch (type) {
    case "textbox":
    case "textarea":
    case "input":
      return {
        id,
        type,
        content: "",
        selected: false,
        fontSize: "md",
        fontWeight: "normal",
        x,
        y,
        zIndex,
      };
    case "image":
      return {
        id,
        type: "image",
        src: "",
        alt: "",
        selected: false,
        x,
        y,
        zIndex,
      };
    case "button":
      return {
        id,
        type: "button",
        label: "",
        selected: false,
        x,
        y,
        zIndex,
      };
    default:
      return null;
  }
}
