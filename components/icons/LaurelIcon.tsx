import type { SVGProps } from "react";

// Our own line-art laurel branch for the guest-favourite badge (SPEC §5.2), traced from
// measurements of ref-full.png: four outlined leaves on a stem that curls at the bottom.
// Drawn for the left side in a 23×36 box; the right side is the mirror image.
const LEAVES = [
  "M8.5 1.6C11.6 3.6 11.8 8.2 8.6 10.8C5.6 8.4 5.4 3.8 8.5 1.6Z",
  "M8.3 17C4 16.5 1.4 14 1.6 10.5C1.7 9.3 2.3 9 3 9.1C6.5 9.6 9.4 12.5 9.4 15.4C9.4 16.3 9 16.9 8.3 17Z",
  "M0.8 18.2C4 17.6 9.5 17.8 11.6 22.8C8 24.6 4 23.6 2.2 20.8C1.6 19.9 1.1 19 0.8 18.2Z",
  "M6.2 27.4C8 24.6 14.5 24.4 18.2 28.4C14.5 30.8 9.3 31 6.2 27.4Z",
];
const STEM =
  "M8.7 11C9.8 13 10 16 10.4 18.5C11 21.5 13 23.5 15.8 25.5C18.5 27.5 19.3 30.5 18.8 32.6C18.4 34.2 16.6 34.8 14.8 34.6";

export interface LaurelIconProps extends Omit<SVGProps<SVGSVGElement>, "children"> {
  side: "left" | "right";
}

export function LaurelIcon({ side, ...rest }: LaurelIconProps) {
  return (
    <svg
      viewBox="0 0 23 36"
      width={23}
      height={36}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      <g transform={side === "right" ? "translate(22 0) scale(-1 1)" : undefined}>
        {LEAVES.map((d) => (
          <path key={d} d={d} />
        ))}
        <path d={STEM} />
      </g>
    </svg>
  );
}
