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
  type: "textbox" | "textarea" | "input";
  fontSize: "sm" | "md" | "lg";
  fontWeight: "normal" | "bold";
  textAlign?: "left" | "center" | "right";
  verticalAlign?: "top" | "middle" | "bottom";
};

// create component types
export type ImageComponent = CanvasComponent & {
  type: "image";
  alt: string;
};

export type ButtonComponent = CanvasComponent & {
  type: "button";
  label?: string;
};

export type InputComponent = CanvasComponent & {
  type: "input";
  placeholder?: string;
  textType?: "text" | "email" | "password" | "number";
  label?: string;
};

export type Component =
  | TextComponent
  | ImageComponent
  | ButtonComponent
  | InputComponent;
