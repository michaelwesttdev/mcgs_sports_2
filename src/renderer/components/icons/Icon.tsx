import { IconName, icons } from ".";
import { SVGProps } from "react";

export interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
  className?: string;
}

export default function DynamicIcon({
  name,
  size = 24,
  className,
  ...props
}: Readonly<IconProps>) {
  const Icon = icons[name];
  if (!Icon) {
    console.warn(`Icon "${name}" not found.`);
    return null;
  }
  return <Icon width={size} height={size} className={className} {...props} />;
}
