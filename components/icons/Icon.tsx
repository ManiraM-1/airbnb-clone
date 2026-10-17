import type { ReactNode, SVGProps } from "react";

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "children"> {
  /** Rendered width and height in px. */
  size?: number;
  /** Accessible name. Without it the icon is decorative (aria-hidden). */
  title?: string;
  /** Draws a diagonal strike for "unavailable" amenities. */
  struck?: boolean;
}

interface BaseIconProps extends IconProps {
  children: ReactNode;
}

/** Shared 24px line-icon frame: stroke uses currentColor. */
export function Icon({
  size = 24,
  title,
  struck = false,
  strokeWidth = 2,
  children,
  ...rest
}: BaseIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {children}
      {struck ? <path d="M3 3l18 18" /> : null}
    </svg>
  );
}
