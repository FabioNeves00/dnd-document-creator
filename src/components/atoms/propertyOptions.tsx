import React from "react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  Bars3CenterLeftIcon,
  Bars3Icon,
  MinusIcon,
} from "@heroicons/react/24/outline";

export interface PropertyButtonOption {
  value: string;
  label: string;
  icon: React.ReactNode;
  tooltip: string;
}

export interface PropertyToggleOption {
  property: string;
  label: string;
  icon: React.ReactNode;
  tooltip: string;
  activeValue: string;
  inactiveValue: string;
}

// Opções para PropertyButtonGrid
export const createTextAlignOptions = (): PropertyButtonOption[] => [
  {
    value: "left",
    label: "Esquerda",
    icon: <ArrowLeftIcon className="w-5 h-5" />,
    tooltip: "Alinhar à esquerda",
  },
  {
    value: "center",
    label: "Centro",
    icon: <Bars3CenterLeftIcon className="w-5 h-5" />,
    tooltip: "Centralizar",
  },
  {
    value: "right",
    label: "Direita",
    icon: <ArrowRightIcon className="w-5 h-5" />,
    tooltip: "Alinhar à direita",
  },
  {
    value: "justify",
    label: "Justificado",
    icon: <Bars3Icon className="w-5 h-5" />,
    tooltip: "Justificar texto",
  },
];

export const createVerticalAlignOptions = (): PropertyButtonOption[] => [
  {
    value: "top",
    label: "Topo",
    icon: <ArrowUpIcon className="w-5 h-5" />,
    tooltip: "Alinhar ao topo",
  },
  {
    value: "middle",
    label: "Centro",
    icon: <MinusIcon className="w-5 h-5" />,
    tooltip: "Centralizar verticalmente",
  },
  {
    value: "bottom",
    label: "Base",
    icon: <ArrowDownIcon className="w-5 h-5" />,
    tooltip: "Alinhar à base",
  },
];

// Opções para PropertyToggleGrid
export const createFontStyleToggles = (): PropertyToggleOption[] => [
  {
    property: "fontWeight",
    label: "Negrito",
    icon: <span className="text-sm font-bold leading-none">B</span>,
    tooltip: "Ativar/desativar negrito",
    activeValue: "bold",
    inactiveValue: "normal",
  },
  {
    property: "fontStyle",
    label: "Itálico",
    icon: <span className="text-sm italic leading-none">I</span>,
    tooltip: "Ativar/desativar itálico",
    activeValue: "italic",
    inactiveValue: "normal",
  },
  {
    property: "textDecoration",
    label: "Sublinhado",
    icon: <span className="text-sm underline leading-none">U</span>,
    tooltip: "Ativar/desativar sublinhado",
    activeValue: "underline",
    inactiveValue: "none",
  },
];
