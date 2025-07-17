import type { SignatureComponent } from "../../types";

export const DEFAULT_SIGNATURE_PROPERTIES: Omit<SignatureComponent, "id"> = {
  type: "signature",
  content: "",
  selected: false,
  x: 0,
  y: 0,
  zIndex: 1,
  backgroundColor: "transparent",
  textColor: "#000",
  width: 250,
  height: 40,
  lineWidth: 200,
  lineColor: "#000",
  signatureText: "Nome:",
  fontSize: 12,
  fontWeight: "normal",
  textAlign: "center",
};
