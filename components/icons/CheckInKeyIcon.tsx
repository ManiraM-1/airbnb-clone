import { Icon, type IconProps } from "./Icon";

// Check-in / house rules (SPEC §7.1, §7.4), traced from ref-full.png at 10×: round head with a
// small hole, short notched shaft to the lower right.
export function CheckInKeyIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M16.1 13.9A8 8 0 1 0 12.4 16.5v3.4h3l3.7 3.35h3.4v-3z" />
      <circle cx="7.5" cy="7.9" r="1.2" />
    </Icon>
  );
}
