import type { DividerComponent } from "../../types";

export const DEFAULT_DIVIDER_PROPERTIES: Omit<DividerComponent, "id"> = {
  type: "divider",
  content: "",
  selected: false,
  x: 0,
  y: 0,
  zIndex: 1,
  backgroundColor: "transparent",
  textColor: "#000",
  width: 300,
  height: 4,
  thickness: 2,
  lineStyle: "solid",
  lineColor: "#000",
};
