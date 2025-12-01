import React from "react";
import { IconProps } from "./Icon";

const MenuIcon = ({
  width,
  height,
  className,
  ...props
}: Omit<IconProps, "name">) => (
  <svg
    {...props}
    width={width}
    height={height}
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'>
    <g id='Menu / Menu_Alt_04'>
      <path
        id='Vector'
        d='M5 17H19M5 12H19M5 7H13'
        stroke={props.color}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </g>
  </svg>
);
const CloseIcon = ({
  width,
  height,
  className,
  ...props
}: Omit<IconProps, "name">) => (
  <svg
    {...props}
    width={width}
    height={height}
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'>
    <g id='Menu / Close_MD'>
      <path
        id='Vector'
        d='M18 18L12 12M12 12L6 6M12 12L18 6M12 12L6 18'
        stroke={props.color}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </g>
  </svg>
);
const MinusIcon = ({
  width,
  height,
  className,
  ...props
}: Omit<IconProps, "name">) => (
  <svg
    {...props}
    width={width}
    height={height}
    viewBox='0 0 24 24'
    fill={props.color}
    xmlns='http://www.w3.org/2000/svg'>
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M4 12C4 11.4477 4.44772 11 5 11H19C19.5523 11 20 11.4477 20 12C20 12.5523 19.5523 13 19 13H5C4.44772 13 4 12.5523 4 12Z'
      stroke={props.color}
    />
  </svg>
);
const MaximizeIcon = ({
  width,
  height,
  className,
  ...props
}: Omit<IconProps, "name">) => (
  <svg
    {...props}
    width={width}
    height={height}
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'>
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M22 5C22 3.34315 20.6569 2 19 2H5C3.34315 2 2 3.34315 2 5V19C2 20.6569 3.34315 22 5 22H19C20.6569 22 22 20.6569 22 19V5ZM20 5C20 4.44772 19.5523 4 19 4H5C4.44772 4 4 4.44772 4 5V19C4 19.5523 4.44772 20 5 20H19C19.5523 20 20 19.5523 20 19V5Z'
      fill={props.color}
    />
  </svg>
);
const MinimizeIcon = ({
  width,
  height,
  className,
  ...props
}: Omit<IconProps, "name">) => (
  <svg
    {...props}
    width={width}
    height={height}
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'>
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M23 4C23 2.34315 21.6569 1 20 1H8C6.34315 1 5 2.34315 5 4V5H4C2.34315 5 1 6.34315 1 8V20C1 21.6569 2.34315 23 4 23H16C17.6569 23 19 21.6569 19 20V19H20C21.6569 19 23 17.6569 23 16V4ZM19 17H20C20.5523 17 21 16.5523 21 16V4C21 3.44772 20.5523 3 20 3H8C7.44772 3 7 3.44772 7 4V5H16C17.6569 5 19 6.34315 19 8V17ZM16 7C16.5523 7 17 7.44772 17 8V20C17 20.5523 16.5523 21 16 21H4C3.44772 21 3 20.5523 3 20V8C3 7.44772 3.44772 7 4 7H16Z'
      fill={props.color}
    />
  </svg>
);
export const custorm = {
  menu: MenuIcon,
  close: CloseIcon,
  minus: MinusIcon,
  maximize: MaximizeIcon,
  minimize: MinimizeIcon,
};
