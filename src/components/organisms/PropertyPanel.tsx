import React from "react";
import type {
  Component as CanvasComponentType,
  TextComponent,
} from "../../types";

interface PropertyPanelProps {
  selectedComponent: CanvasComponentType | undefined;
  onPropChange: (
    prop: keyof CanvasComponentType | keyof TextComponent,
    value: string | undefined
  ) => void;
}

function isTextComponent(comp: CanvasComponentType): comp is TextComponent {
  return (
    comp.type === "textbox" || comp.type === "textarea" || comp.type === "input"
  );
}

const PropertyPanel: React.FC<PropertyPanelProps> = ({
  selectedComponent,
  onPropChange,
}) => {
  if (!selectedComponent) return null;
  return (
    <div className="bg-[#232a36] rounded-xl p-4 gap-4 flex flex-col border border-[#2d3646] text-gray-200">
      {/* Conteúdo principal */}
      {(isTextComponent(selectedComponent) ||
        selectedComponent.type === "button") && (
        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-300">
            {selectedComponent.type === "button" ? "Label do botão" : "Texto"}
          </span>
          <input
            className="border border-[#2d3646] rounded p-2 text-gray-200 bg-[#232a36] placeholder-gray-400"
            value={selectedComponent.content || ""}
            onChange={(e) => onPropChange("content", e.target.value)}
            placeholder={
              selectedComponent.type === "button"
                ? "Texto do botão"
                : "Digite o texto"
            }
          />
        </label>
      )}
      {selectedComponent.type === "image" && (
        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-300">Imagem</span>
          <input
            type="file"
            accept="image/png,image/jpeg"
            className="border border-[#2d3646] rounded p-2 text-gray-200 bg-[#232a36] placeholder-gray-400"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = (ev) => {
                onPropChange("content", ev.target?.result as string);
              };
              reader.readAsDataURL(file);
            }}
            data-cy="property-image-upload"
          />
        </label>
      )}
      {/* Inputs de tamanho */}
      <div className="flex gap-4">
        <label className="flex flex-col gap-1 w-1/2">
          <span className="text-sm text-gray-300">Largura (px)</span>
          <input
            type="number"
            min={20}
            className="border border-[#2d3646] rounded p-2 text-gray-200 bg-[#232a36] placeholder-gray-400"
            value={selectedComponent.width ?? ""}
            onChange={(e) => onPropChange("width", e.target.value)}
            placeholder="Auto"
            data-cy="property-width"
          />
        </label>
        <label className="flex flex-col gap-1 w-1/2">
          <span className="text-sm text-gray-300">Altura (px)</span>
          <input
            type="number"
            min={20}
            className="border border-[#2d3646] rounded p-2 text-gray-200 bg-[#232a36] placeholder-gray-400"
            value={selectedComponent.height ?? ""}
            onChange={(e) => onPropChange("height", e.target.value)}
            placeholder="Auto"
            data-cy="property-height"
          />
        </label>
      </div>
      {/* Cores */}
      <div className="flex gap-4 items-center">
        <label className="flex flex-col gap-1">
          <span className="text-xs text-gray-300">Cor de fundo</span>
          <input
            type="color"
            value={selectedComponent.backgroundColor || "#181c23"}
            onChange={(e) => onPropChange("backgroundColor", e.target.value)}
            className="w-8 h-8 p-0 border-none bg-transparent"
            data-cy="color-bg"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-gray-300">Cor do texto</span>
          <input
            type="color"
            value={selectedComponent.textColor || "#ffffff"}
            onChange={(e) => onPropChange("textColor", e.target.value)}
            className="w-8 h-8 p-0 border-none bg-transparent"
            data-cy="color-text"
          />
        </label>
      </div>
      {/* Propriedades de texto */}
      {isTextComponent(selectedComponent) && (
        <>
          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-300">Alinhamento do texto</span>
            <select
              data-cy="property-text-align"
              className="border border-[#2d3646] rounded p-2 text-gray-200 bg-[#232a36]"
              value={selectedComponent.textAlign || "left"}
              onChange={(e) => onPropChange("textAlign", e.target.value)}
            >
              <option value="left">Esquerda</option>
              <option value="center">Centro</option>
              <option value="right">Direita</option>
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-300">Alinhamento vertical</span>
            <select
              data-cy="property-vertical-align"
              className="border border-[#2d3646] rounded p-2 text-gray-200 bg-[#232a36]"
              value={selectedComponent.verticalAlign || "top"}
              onChange={(e) => onPropChange("verticalAlign", e.target.value)}
            >
              <option value="top">Em cima</option>
              <option value="middle">Centro</option>
              <option value="bottom">Embaixo</option>
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-300">Tamanho da fonte</span>
            <select
              data-cy="property-font-size"
              className="border border-[#2d3646] rounded p-2 text-gray-200 bg-[#232a36]"
              value={selectedComponent.fontSize}
              onChange={(e) => onPropChange("fontSize", e.target.value)}
            >
              <option value="sm">Pequeno</option>
              <option value="md">Médio</option>
              <option value="lg">Grande</option>
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-300">Peso da fonte</span>
            <select
              data-cy="property-font-weight"
              className="border border-[#2d3646] rounded p-2 text-gray-200 bg-[#232a36]"
              value={selectedComponent.fontWeight}
              onChange={(e) => onPropChange("fontWeight", e.target.value)}
            >
              <option value="normal">Normal</option>
              <option value="bold">Negrito</option>
            </select>
          </label>
        </>
      )}
    </div>
  );
};

export default PropertyPanel;
