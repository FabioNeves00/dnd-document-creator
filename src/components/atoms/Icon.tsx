import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  title?: string;
  "data-cy"?: string;
}

const Icon: React.FC<IconProps> = ({ title, "data-cy": dataCy, ...props }) => (
  <svg
    aria-hidden={title ? undefined : true}
    role={title ? "img" : "presentation"}
    data-cy={dataCy}
    {...props}
  >
    {title ? <title>{title}</title> : null}
    {props.children}
  </svg>
);

export default Icon; 