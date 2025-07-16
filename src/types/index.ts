export interface SidebarItem {
  type: Component["type"];
  label: string;
  dataCy: string;
  group?: string;
}

export interface CanvasComponent {
  id: string;
  type: string;
  content?: string;
  selected?: boolean;
  x: number;
  y: number;
  zIndex: number;
  width?: number; // largura em px
  height?: number; // altura em px
  backgroundColor?: string; // cor de fundo
  textColor?: string; // cor do texto
}

export type TextComponent = CanvasComponent & {
  type: "textarea";
  fontSize: number; // tamanho da fonte em px
  fontWeight: "normal" | "bold";
  fontStyle: "normal" | "italic";
  textDecoration: "none" | "underline";
  textAlign: "left" | "center" | "right" | "justify";
  verticalAlign?: "top" | "middle" | "bottom";
};

// create component types
export type ImageComponent = CanvasComponent & {
  type: "image";
  alt: string;
};

export type Component = TextComponent | ImageComponent;
