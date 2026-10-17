import { Icon, type IconProps } from "./Icon";

/** Arrow up out of an open tray; square tray corners. */
export function ShareIcon(props: IconProps) {
  return (
    <Icon strokeLinejoin="miter" {...props}>
      <path d="M12 2.25v16.5" strokeLinecap="butt" />
      <path d="M4.5 9.5L12 2l7.5 7.5" />
      <path d="M3.75 14.25v8.25h16.5v-8.25" strokeLinecap="butt" />
    </Icon>
  );
}
