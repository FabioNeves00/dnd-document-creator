import type { TextComponent } from "../../types";

export const DEFAULT_TITLE_PROPERTIES: Omit<TextComponent, "id"> = {
  type: "textarea",
  content: "Título",
  selected: false,
  fontSize: 24,
  fontWeight: "bold",
  fontStyle: "normal",
  textDecoration: "none",
  x: 0,
  y: 0,
  zIndex: 1,
  backgroundColor: "transparent",
  textColor: "#000",
  textAlign: "left",
  verticalAlign: "top",
  width: 200,
  height: 32,
};
