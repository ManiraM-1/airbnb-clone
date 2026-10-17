import { Icon, type IconProps } from "./Icon";

// Map-pin house (SPEC §7.2), traced from ref-full.png at 4×: drawn to sit in a 56px circle,
// low in the frame, with a ground line wider than the house and square ends.
export function HomePinIcon(props: IconProps) {
  return (
    <Icon strokeWidth={1.3} strokeLinecap="butt" strokeLinejoin="miter" {...props}>
      <path d="M6.65 21.9V10.9L12 6.6l5.35 4.3v11" />
      <path d="M9.65 21.9v-5.6h4.7v5.6" />
      <path d="M3.85 21.9h16.3" />
    </Icon>
  );
}
