import React from "react";
import PropertyPanel from "./PropertyPanel";
import Button from "../atoms/Button";
import {
  Squares2X2Icon,
  ArrowUpIcon,
  ArrowDownIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import type { Component } from "../../types";

interface PropertyPanelWrapperProps {
  selectedComponent: Component | undefined;
  onPropChange: (
    prop: string | number | symbol,
    value: string | undefined
  ) => void;
  onBringForward: () => void;
  onSendBackward: () => void;
  onRemoveComponent: () => void;
}

const PropertyPanelWrapper: React.FC<PropertyPanelWrapperProps> = ({
  selectedComponent,
  onPropChange,
  onBringForward,
  onSendBackward,
  onRemoveComponent,
}) => {
  if (!selectedComponent) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-500 select-none">
        <span>Nenhum componente selecionado</span>
      </div>
    );
  }
  return (
    <>
      <div className="mb-4">
        <div className="flex items-center gap-2 text-lg font-bold text-gray-100 mb-4">
          <Squares2X2Icon
            className="w-5 h-5 text-gray-300"
            aria-hidden="true"
          />
          Propriedades
        </div>
        <div className="border-b border-[#2d3646] mb-4"></div>
        <div className="flex flex-col gap-4 mb-4">
          <Button
            data-cy="property-bring-forward"
            icon={
              <ArrowUpIcon
                className="w-5 h-5 text-gray-300"
                aria-hidden="true"
              />
            }
            onClick={onBringForward}
            aria-label="Trazer para frente"
            className="bg-[#232a36] border-[#2d3646] text-white hover:bg-[#2d3646]/80"
          >
            Trazer para frente
          </Button>
          <Button
            data-cy="property-send-backward"
            icon={
              <ArrowDownIcon
                className="w-5 h-5 text-gray-300"
                aria-hidden="true"
              />
            }
            onClick={onSendBackward}
            aria-label="Enviar para trás"
            className="bg-[#232a36] border-[#2d3646] text-white hover:bg-[#2d3646]/80"
          >
            Enviar para trás
          </Button>
          <Button
            data-cy="property-remove"
            icon={
              <TrashIcon className="w-5 h-5 text-red-400" aria-hidden="true" />
            }
            onClick={onRemoveComponent}
            aria-label="Remover componente"
            className="bg-[#2d3646] border-[#2d3646] text-red-400 hover:bg-red-700/80"
          >
            Remover
          </Button>
        </div>
      </div>
      <PropertyPanel
        selectedComponent={selectedComponent}
        onPropChange={onPropChange}
      />
    </>
  );
};

export default PropertyPanelWrapper;
