import React from "react";
import type { PropertyToggleOption } from "./propertyOptions";

interface PropertyToggleGridProps {
  label: string;
  values: Record<string, string>;
  options: PropertyToggleOption[];
  dataCy?: string;
  onChange: (property: string, value: string) => void;
}

const PropertyToggleGrid: React.FC<PropertyToggleGridProps> = ({
  label,
  values,
  options,
  dataCy,
  onChange,
}) => {
  const isActive = (option: PropertyToggleOption): boolean => {
    return values[option.property] === option.activeValue;
  };

  const handleToggle = (option: PropertyToggleOption) => {
    const currentlyActive = isActive(option);
    const newValue = currentlyActive
      ? option.inactiveValue
      : option.activeValue;
    onChange(option.property, newValue);
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm text-gray-300">{label}</span>
      <div className="flex flex-row gap-2 flex-wrap" data-cy={dataCy}>
        {options.map((option) => {
          const active = isActive(option);
          return (
            <button
              key={option.property}
              type="button"
              title={option.tooltip}
              className={`
                relative p-2 rounded border transition-all duration-200 
                flex items-center justify-center min-h-[40px]
                ${
                  active
                    ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/25"
                    : "bg-[#232a36] border-[#2d3646] text-gray-400 hover:bg-[#2d3646] hover:border-gray-500 hover:text-gray-300"
                }
              `}
              onClick={() => handleToggle(option)}
              data-cy={`${dataCy}-${option.property}`}
              aria-label={option.tooltip}
              aria-pressed={active}
              role="checkbox"
            >
              <div
                className={`w-5 h-5 transition-all duration-200 ${
                  active ? "scale-110" : "scale-100"
                }`}
              >
                {option.icon}
              </div>
              {active && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PropertyToggleGrid;
