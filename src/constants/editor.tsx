import type { SidebarItem } from "../types";
import {
  PencilSquareIcon,
  PhotoIcon,
  DocumentTextIcon,
  MinusIcon,
} from "@heroicons/react/24/outline";

export const COMPONENTS: SidebarItem[] = [
  {
    type: "textarea",
    label: "Área de texto",
    dataCy: "sidebar-textarea",
    group: "Caixas de texto",
  },
  {
    type: "title",
    label: "Título",
    dataCy: "sidebar-title",
    group: "Textos predefinidos",
  },
  {
    type: "subtitle",
    label: "Subtítulo",
    dataCy: "sidebar-subtitle",
    group: "Textos predefinidos",
  },
  {
    type: "paragraph",
    label: "Parágrafo",
    dataCy: "sidebar-paragraph",
    group: "Textos predefinidos",
  },
  {
    type: "divider",
    label: "Divisória",
    dataCy: "sidebar-divider",
    group: "Elementos",
  },
  {
    type: "signature",
    label: "Assinatura",
    dataCy: "sidebar-signature",
    group: "Elementos",
  },
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
    name: "Textos predefinidos",
    icon: (
      <DocumentTextIcon className="w-5 h-5 text-gray-600" aria-hidden="true" />
    ),
  },
  {
    name: "Elementos",
    icon: <MinusIcon className="w-5 h-5 text-gray-600" aria-hidden="true" />,
  },
  {
    name: "Imagens",
    icon: <PhotoIcon className="w-5 h-5 text-gray-600" aria-hidden="true" />,
  },
];
