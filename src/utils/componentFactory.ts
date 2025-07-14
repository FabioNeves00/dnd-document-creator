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
        backgroundColor: "transparent",
        textColor: "#000",
      };
    case "image":
      return {
        id,
        type: "image",
        content: "",
        alt: "",
        selected: false,
        x,
        y,
        zIndex,
        backgroundColor: "transparent",
        textColor: "#000",
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
        backgroundColor: "transparent",
        textColor: "#000",
      };
    default:
      return null;
  }
}
