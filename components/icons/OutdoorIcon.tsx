import { Icon, type IconProps } from "./Icon";

export function OutdoorIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 3a9 9 0 0 1 9 9H3a9 9 0 0 1 9-9z" />
      <path d="M12 12v9" />
      <path d="M8 21h8" />
    </Icon>
  );
}
