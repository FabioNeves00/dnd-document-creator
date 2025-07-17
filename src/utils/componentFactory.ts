import { DEFAULT_TEXT_PROPERTIES } from "../constants/properties/textProperties";
import { DEFAULT_IMAGE_PROPERTIES } from "../constants/properties/imageProperties";
import { DEFAULT_TITLE_PROPERTIES } from "../constants/properties/titleProperties";
import { DEFAULT_SUBTITLE_PROPERTIES } from "../constants/properties/subtitleProperties";
import { DEFAULT_PARAGRAPH_PROPERTIES } from "../constants/properties/paragraphProperties";
import { DEFAULT_DIVIDER_PROPERTIES } from "../constants/properties/dividerProperties";
import { DEFAULT_SIGNATURE_PROPERTIES } from "../constants/properties/signatureProperties";
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
    case "title":
      return {
        ...DEFAULT_TITLE_PROPERTIES,
        id,
        type: "textarea", // Usar textarea para todos os componentes de texto
        x,
        y,
        zIndex,
      };
    case "subtitle":
      return {
        ...DEFAULT_SUBTITLE_PROPERTIES,
        id,
        type: "textarea", // Usar textarea para todos os componentes de texto
        x,
        y,
        zIndex,
      };
    case "paragraph":
      return {
        ...DEFAULT_PARAGRAPH_PROPERTIES,
        id,
        type: "textarea", // Usar textarea para todos os componentes de texto
        x,
        y,
        zIndex,
      };
    case "divider":
      return {
        ...DEFAULT_DIVIDER_PROPERTIES,
        id,
        type: "divider",
        x,
        y,
        zIndex,
      };
    case "signature":
      return {
        ...DEFAULT_SIGNATURE_PROPERTIES,
        id,
        type: "signature",
        x,
        y,
        zIndex,
      };
    default:
      return null;
  }
}
