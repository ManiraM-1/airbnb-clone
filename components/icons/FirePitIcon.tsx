import { Icon, type IconProps } from "./Icon";

/** Flame over an open fire-pit tray ("Outdoor entertainment" highlight). */
export function FirePitIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6.5 14.5V10.4c0-1.7.8-3.1 2.2-4.1l1.3.4c.1-1.9.8-3.6 1.9-4.9 1.2 1.5 2.5 2.8 3.6 4.1.9 1 1.5 2.4 1.5 4v4.6" />
      <path d="M10.2 14.5v-2.3a1.75 1.75 0 0 1 3.5 0v2.3" />
      <path d="M2 14.5h20" />
      <path d="M3 14.5v7.25h18V14.5" />
    </Icon>
  );
}
