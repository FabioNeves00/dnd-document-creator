import type { TextComponent } from "../../types";

export const DEFAULT_SUBTITLE_PROPERTIES: Omit<TextComponent, "id"> = {
  type: "textarea",
  content: "Subtítulo",
  selected: false,
  fontSize: 18,
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
  width: 180,
  height: 28,
};
