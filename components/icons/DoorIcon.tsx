import { Icon, type IconProps } from "./Icon";

export function DoorIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5 21V3h14v18" />
      <path d="M3 21h18" />
      <path d="M15 12h.01" />
    </Icon>
  );
}
