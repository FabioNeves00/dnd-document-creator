import type { TextComponent } from "../../types";

export const DEFAULT_TEXT_PROPERTIES: Omit<TextComponent, "id"> = {
  type: "textarea",
  content: "",
  selected: false,
  fontSize: 16,
  fontWeight: "normal",
  fontStyle: "normal",
  textDecoration: "none",
  x: 0,
  y: 0,
  zIndex: 1,
  width: 200,
  height: 40,
  backgroundColor: "transparent",
  textColor: "#000",
  textAlign: "left",
  verticalAlign: "top",
};
