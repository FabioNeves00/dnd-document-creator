import React from "react";
import PropertyInput from "../atoms/PropertyInput";
import PropertyButtonGrid from "../atoms/PropertyButtonGrid";
import PropertyToggleGrid from "../atoms/PropertyToggleGrid";
import {
  createTextAlignOptions,
  createVerticalAlignOptions,
  createFontStyleToggles,
} from "../atoms/propertyOptions";
import type {
  Component as CanvasComponentType,
  TextComponent,
} from "../../types";

interface PropertySectionProps {
  component: CanvasComponentType;
  onPropChange: (prop: string, value: string) => void;
}

// Seção de conteúdo (texto/imagem)
export const ContentSection: React.FC<PropertySectionProps> = ({
  component,
  onPropChange,
}) => {
  if (component.type === "image") {
    return (
      <div data-cy="property-content-section">
        <PropertyInput
          label="Imagem"
          type="file"
          accept="image/png,image/jpeg,image/gif,image/webp"
          dataCy="property-image-upload"
          onChange={() => {}} // Handled by onFileChange
          onFileChange={(file) => {
            const reader = new FileReader();
            reader.onload = (ev) => {
              onPropChange("content", ev.target?.result as string);
            };
            reader.readAsDataURL(file);
          }}
        />
      </div>
    );
  }

  if (component.type === "textarea") {
    return (
      <div data-cy="property-content-section">
        <PropertyInput
          label="Texto"
          value={component.content || ""}
          placeholder="Digite o texto"
          onChange={(value) => onPropChange("content", value)}
          dataCy="property-content-input"
        />
      </div>
    );
  }

  return null;
};

// Seção de dimensões
export const DimensionsSection: React.FC<PropertySectionProps> = ({
  component,
  onPropChange,
}) => (
  <div className="flex gap-4" data-cy="property-dimensions-section">
    <div className="w-1/2">
      <PropertyInput
        label="Largura (px)"
        type="number"
        value={component.width}
        min={20}
        placeholder="Auto"
        dataCy="property-width"
        onChange={(value) => onPropChange("width", value)}
      />
    </div>
    <div className="w-1/2">
      <PropertyInput
        label="Altura (px)"
        type="number"
        value={component.height}
        min={20}
        placeholder="Auto"
        dataCy="property-height"
        onChange={(value) => onPropChange("height", value)}
      />
    </div>
  </div>
);

// Seção de cores
export const ColorsSection: React.FC<PropertySectionProps> = ({
  component,
  onPropChange,
}) => (
  <div className="flex gap-4 items-center" data-cy="property-colors-section">
    <PropertyInput
      label="Cor de fundo"
      type="color"
      value={component.backgroundColor || "#181c23"}
      dataCy="color-bg"
      onChange={(value) => onPropChange("backgroundColor", value)}
    />
    <PropertyInput
      label="Cor do texto"
      type="color"
      value={component.textColor || "#ffffff"}
      dataCy="color-text"
      onChange={(value) => onPropChange("textColor", value)}
    />
  </div>
);

// Seção de tipografia (apenas para componentes de texto)
export const TypographySection: React.FC<PropertySectionProps> = ({
  component,
  onPropChange,
}) => {
  const isTextComponent = (comp: CanvasComponentType): comp is TextComponent =>
    comp.type === "textarea";

  if (!isTextComponent(component)) return null;

  return (
    <div className="grid gap-4" data-cy="property-typography-section">
      {/* Alinhamento do texto */}
      <PropertyButtonGrid
        label="Alinhamento do texto"
        value={component.textAlign}
        options={createTextAlignOptions()}
        dataCy="property-text-align"
        onChange={(value) => onPropChange("textAlign", value)}
      />

      {/* Alinhamento vertical */}
      <PropertyButtonGrid
        label="Alinhamento vertical"
        value={component.verticalAlign || "top"}
        options={createVerticalAlignOptions()}
        dataCy="property-vertical-align"
        onChange={(value) => onPropChange("verticalAlign", value)}
      />

      {/* Tamanho da fonte */}
      <PropertyInput
        label="Tamanho da fonte (px)"
        type="number"
        value={component.fontSize}
        min={8}
        max={100}
        dataCy="property-font-size"
        onChange={(value) => onPropChange("fontSize", value)}
      />

      {/* Estilos de fonte (toggles) */}
      <PropertyToggleGrid
        label="Estilo de fonte"
        values={{
          fontWeight: component.fontWeight,
          fontStyle: component.fontStyle,
          textDecoration: component.textDecoration,
        }}
        options={createFontStyleToggles()}
        dataCy="property-font-styles"
        onChange={onPropChange}
      />
    </div>
  );
};
