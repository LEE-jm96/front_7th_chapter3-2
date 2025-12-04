import { SVGProps } from "react";

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "width" | "height"> {
  size?: number;
}

const buildProps = ({ size = 24, ...rest }: IconProps = {}) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  ...rest,
});

export const CartIcon = (props: IconProps) => (
  <svg {...buildProps(props)}>
    <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5" />
    <path d="M7 13l-2.293 2.293A1 1 0 0 0 5.414 16H17" />
    <circle cx="17" cy="18" r="2" />
    <circle cx="9" cy="18" r="2" />
  </svg>
);

export const AdminIcon = (props: IconProps) => (
  <svg {...buildProps(props)}>
    <path d="M5.121 17.804A7 7 0 0 1 12 14a7 7 0 0 1 6.879 3.804" />
    <circle cx="12" cy="9" r="3" />
    <path d="M18 3v4m2-2h-4" />
  </svg>
);

export const PlusIcon = (props: IconProps) => (
  <svg {...buildProps(props)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const MinusIcon = (props: IconProps) => (
  <svg {...buildProps(props)}>
    <path d="M5 12h14" />
  </svg>
);

export const TrashIcon = (props: IconProps) => (
  <svg {...buildProps(props)}>
    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

export const ChevronDownIcon = (props: IconProps) => (
  <svg {...buildProps(props)}>
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export const ChevronUpIcon = (props: IconProps) => (
  <svg {...buildProps(props)}>
    <path d="M18 15l-6-6-6 6" />
  </svg>
);

export const CheckIcon = (props: IconProps) => (
  <svg {...buildProps(props)}>
    <path d="M5 13l4 4L19 7" />
  </svg>
);

