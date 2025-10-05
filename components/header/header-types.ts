
// components/header/types.ts
import * as React from "react";

export type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

export type HeaderNavItem = {
  href: string;
  label: string;
  icon: IconComponent; // actual component, not a string
};
