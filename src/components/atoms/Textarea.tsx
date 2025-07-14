import React from "react";
import clsx from "clsx";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  align?: "left" | "center" | "right";
  "data-cy"?: string;
}

const Textarea: React.FC<TextareaProps> = ({
  align = "left",
  className,
  "data-cy": dataCy,
  ...props
}) => (
  <textarea
    data-cy={dataCy}
    className={clsx(
      "bg-transparent border border-gray-300 rounded px-2 py-1 w-full h-full text-gray-100 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400",
      align === "center" && "text-center",
      align === "right" && "text-right",
      align === "left" && "text-left",
      className
    )}
    {...props}
  />
);

export default Textarea;
