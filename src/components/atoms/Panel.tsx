import React from "react";
import clsx from "clsx";

interface PanelProps {
  children: React.ReactNode;
  className?: string;
}

const Panel: React.FC<PanelProps> = ({ children, className }) => (
  <div className={clsx("rounded-xl border", className)}>{children}</div>
);

export default Panel;
