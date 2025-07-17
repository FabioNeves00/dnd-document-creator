import type { TextComponent } from "../../types";

export const DEFAULT_PARAGRAPH_PROPERTIES: Omit<TextComponent, "id"> = {
  type: "textarea",
  content:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  selected: false,
  fontSize: 16,
  fontWeight: "normal",
  fontStyle: "normal",
  textDecoration: "none",
  x: 0,
  y: 0,
  zIndex: 1,
  backgroundColor: "transparent",
  textColor: "#000",
  textAlign: "justify",
  verticalAlign: "top",
  width: 300,
  height: 60,
};
