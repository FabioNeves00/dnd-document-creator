import React from "react";
import type {
  Component as CanvasComponentType,
  TextComponent,
} from "../../types";
import {
  ContentSection,
  DimensionsSection,
  ColorsSection,
  TypographySection,
} from "./PropertySections";

interface PropertyPanelProps {
  selectedComponent: CanvasComponentType | undefined;
  onPropChange: (
    prop: keyof CanvasComponentType | keyof TextComponent,
    value: string | undefined
  ) => void;
}

const PropertyPanel: React.FC<PropertyPanelProps> = ({
  selectedComponent,
  onPropChange,
}) => {
  if (!selectedComponent) return null;

  const handlePropChange = (prop: string, value: string) => {
    onPropChange(prop as keyof CanvasComponentType, value);
  };

  return (
    <div className="bg-[#232a36] rounded-xl p-4 gap-4 flex flex-col border border-[#2d3646] text-gray-200">
      <ContentSection
        component={selectedComponent}
        onPropChange={handlePropChange}
      />

      <DimensionsSection
        component={selectedComponent}
        onPropChange={handlePropChange}
      />

      <ColorsSection
        component={selectedComponent}
        onPropChange={handlePropChange}
      />

      <TypographySection
        component={selectedComponent}
        onPropChange={handlePropChange}
      />
    </div>
  );
};

export default PropertyPanel;
