import React from "react";
import type { PropertyButtonOption } from "./propertyOptions";

interface PropertyButtonGridProps {
  label: string;
  value: string;
  options: PropertyButtonOption[];
  dataCy?: string;
  onChange: (value: string) => void;
}

const PropertyButtonGrid: React.FC<PropertyButtonGridProps> = ({
  label,
  value,
  options,
  dataCy,
  onChange,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm text-gray-300">{label}</span>
      <div className="flex flex-row gap-2 flex-wrap" data-cy={dataCy}>
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            title={option.tooltip}
            className={`
              relative p-2 rounded border transition-all duration-200 
              flex items-center justify-center min-h-[40px]
              ${
                value === option.value
                  ? "bg-blue-600 border-blue-500 text-white"
                  : "bg-[#232a36] border-[#2d3646] text-gray-300 hover:bg-[#2d3646] hover:border-gray-500"
              }
            `}
            onClick={() => onChange(option.value)}
            data-cy={`${dataCy}-${option.value}`}
            aria-label={option.tooltip}
          >
            <div className="w-5 h-5">{option.icon}</div>
            {value === option.value && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PropertyButtonGrid;
