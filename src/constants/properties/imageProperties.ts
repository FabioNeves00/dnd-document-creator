import type { ImageComponent } from "../../types";

export const DEFAULT_IMAGE_PROPERTIES: Omit<ImageComponent, "id"> = {
  type: "image",
  content: "",
  alt: "",
  selected: false,
  x: 0,
  y: 0,
  zIndex: 1,
  width: 200,
  height: 150,
  backgroundColor: "transparent",
  textColor: "#000",
};
