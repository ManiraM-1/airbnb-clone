import type { SVGProps } from "react";

// Our own drawing of the logo (SPEC §2), sized to the 103×32 ink box measured in ref-top.png.
// Symbol: one continuous ribbon stroke (apex, two bottom lobes, inner loop).
// Wordmark: geometric stems (rects) and bowls (circles/arcs), coordinates in px from the logo's top-left.
const SYMBOL =
  "M14.6 1.3C13.2 1.3 12.3 2.2 11.6 3.6L2 21.5C1.5 22.6 1.2 23.8 1.2 25" +
  "C1.2 27.8 3.4 29.8 6.4 29.8C9.4 29.8 12.2 27.5 14.6 24.6" +
  "C16.6 22 18.6 19.6 18.6 17C18.6 14.7 16.8 13 14.6 13C12.4 13 10.6 14.7 10.6 17" +
  "C10.6 19.6 12.6 22 14.6 24.6C17 27.5 19.8 29.8 22.8 29.8C25.8 29.8 28 27.8 28 25" +
  "C28 23.8 27.7 22.6 27.2 21.5L17.6 3.6C16.9 2.2 16 1.3 14.6 1.3Z";

type AirbnbLogoProps = Omit<SVGProps<SVGSVGElement>, "children">;

export function AirbnbLogo(props: AirbnbLogoProps) {
  return (
    <svg
      viewBox="0 0 103 32"
      width={103}
      height={32}
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path
        d={SYMBOL}
        transform="scale(1.02 1.035)"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
      <g fill="currentColor">
        {/* a, i, r, b, n, b stems */}
        <rect x={44.3} y={11.4} width={2.8} height={13.4} />
        <rect x={48.9} y={12} width={3.2} height={12.2} />
        <circle cx={50.5} cy={8.7} r={1.7} />
        <rect x={54.1} y={12} width={2.8} height={12.8} />
        <rect x={62.1} y={6} width={2.8} height={18.8} />
        <rect x={77.1} y={12} width={2.8} height={12.8} />
        <rect x={90.1} y={6} width={2.8} height={18.8} />
      </g>
      <g fill="none" stroke="currentColor" strokeWidth={2.8}>
        <ellipse cx={40.5} cy={18} rx={4.6} ry={5.4} />
        <path d="M55.5 18C55.5 14.8 57.6 13.4 61.2 13.4" />
        <ellipse cx={68.9} cy={18} rx={5} ry={5.4} />
        <path d="M78.5 18C78.5 15 80.5 13.4 83 13.4C85.5 13.4 87 15 87 18V24" />
        <ellipse cx={96.5} cy={18} rx={4.6} ry={5.4} />
      </g>
    </svg>
  );
}
