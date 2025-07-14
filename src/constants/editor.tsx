import type { SidebarItem } from "../types";
import {
  PencilSquareIcon,
  CursorArrowRaysIcon,
  EllipsisHorizontalIcon,
  PhotoIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";

export const COMPONENTS: SidebarItem[] = [
  {
    type: "textbox",
    label: "Caixa de texto",
    dataCy: "sidebar-textbox",
    group: "Caixas de texto",
  },
  {
    type: "textarea",
    label: "Área de texto",
    dataCy: "sidebar-textarea",
    group: "Caixas de texto",
  },
  {
    type: "input",
    label: "Campo de entrada",
    dataCy: "sidebar-input",
    group: "Inputs",
  },
  { type: "button", label: "Botão", dataCy: "sidebar-button", group: "Botões" },
  { type: "image", label: "Imagem", dataCy: "sidebar-image", group: "Imagens" },
];

export const groupOrder = [
  {
    name: "Caixas de texto",
    icon: (
      <PencilSquareIcon className="w-5 h-5 text-gray-600" aria-hidden="true" />
    ),
  },
  {
    name: "Inputs",
    icon: (
      <CursorArrowRaysIcon
        className="w-5 h-5 text-gray-600"
        aria-hidden="true"
      />
    ),
  },
  {
    name: "Botões",
    icon: (
      <Squares2X2Icon className="w-5 h-5 text-gray-600" aria-hidden="true" />
    ),
  },
  {
    name: "Imagens",
    icon: <PhotoIcon className="w-5 h-5 text-gray-600" aria-hidden="true" />,
  },
  {
    name: "Outros",
    icon: (
      <EllipsisHorizontalIcon
        className="w-5 h-5 text-gray-600"
        aria-hidden="true"
      />
    ),
  },
];
