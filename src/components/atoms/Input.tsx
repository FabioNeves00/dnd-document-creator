import React from "react";
import clsx from "clsx";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  align?: "left" | "center" | "right";
  verticalAlign?: "top" | "middle" | "bottom";
  "data-cy"?: string;
}

const Input: React.FC<InputProps> = ({
  align = "left",
  verticalAlign = "top",
  className,
  "data-cy": dataCy,
  ...props
}) => (
  <input
    data-cy={dataCy}
    className={clsx(
      "bg-transparent border border-gray-300 rounded px-2 py-1 w-full h-full text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400",
      align === "center" && "text-center",
      align === "right" && "text-right",
      align === "left" && "text-left",
      verticalAlign === "top" && "items-start",
      verticalAlign === "middle" && "items-center",
      verticalAlign === "bottom" && "items-end",
      className
    )}
    {...props}
  />
);

export default Input;
