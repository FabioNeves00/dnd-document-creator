import type { SidebarItem } from "../types";
import { PencilSquareIcon, PhotoIcon } from "@heroicons/react/24/outline";

export const COMPONENTS: SidebarItem[] = [
  {
    type: "textarea",
    label: "Área de texto",
    dataCy: "sidebar-textarea",
    group: "Caixas de texto",
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
    name: "Imagens",
    icon: <PhotoIcon className="w-5 h-5 text-gray-600" aria-hidden="true" />,
  },
];
