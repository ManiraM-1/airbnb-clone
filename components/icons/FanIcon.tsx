import { Icon, type IconProps } from "./Icon";

/** One teardrop blade from the hub, widest at the tip; drawn four times a quarter turn apart. */
const BLADE = "M10.7 10.3C9.4 8.3 8.5 6.7 8.6 4.9 8.7 3 10.2 1.9 12 2c1.8.1 3.1 1.4 2.9 3.2-.2 1.8-1 3.4-1.6 5.1";
const ANGLES = [0, 90, 180, 270];
/** Slight pinwheel twist, as in the reference glyph. */
const TWIST = -12;

/** Ceiling fan seen from below: hub with four pinwheel blades. */
export function FanIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="1.6" />
      {ANGLES.map((angle) => (
        <path key={angle} d={BLADE} transform={`rotate(${angle + TWIST} 12 12)`} />
      ))}
    </Icon>
  );
}
