import React from "react";

interface PropertyInputProps {
  label: string;
  type?: "text" | "number" | "color" | "file";
  value?: string | number;
  placeholder?: string;
  accept?: string;
  min?: number;
  dataCy?: string;
  onChange: (value: string) => void;
  onFileChange?: (file: File) => void;
}

const PropertyInput: React.FC<PropertyInputProps> = ({
  label,
  type = "text",
  value,
  placeholder,
  accept,
  min,
  dataCy,
  onChange,
  onFileChange,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === "file" && onFileChange) {
      const file = e.target.files?.[0];
      if (file) onFileChange(file);
    } else {
      onChange(e.target.value);
    }
  };

  const inputClasses =
    type === "color"
      ? "w-8 h-8 p-0 border-none bg-transparent"
      : "border border-[#2d3646] rounded p-2 text-gray-200 bg-[#232a36] placeholder-gray-400";

  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm text-gray-300">{label}</span>
      <input
        type={type}
        value={type !== "file" ? value || "" : undefined}
        placeholder={placeholder}
        accept={accept}
        min={min}
        data-cy={dataCy}
        className={inputClasses}
        onChange={handleChange}
      />
    </label>
  );
};

export default PropertyInput;
