import React from "react";
import clsx from "clsx";

interface ButtonProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  "data-cy"?: string;
  "aria-label"?: string;
  type?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({
  children,
  icon,
  onClick,
  className,
  "data-cy": dataCy,
  "aria-label": ariaLabel,
  type = "button",
}) => (
  <button
    type={type}
    data-cy={dataCy}
    aria-label={ariaLabel}
    onClick={onClick}
    className={clsx(
      "flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-blue-400",
      className
    )}
  >
    {icon && <span className="text-gray-500">{icon}</span>}
    {children}
  </button>
);

export default Button;
