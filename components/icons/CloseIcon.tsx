import { Icon, type IconProps } from "./Icon";

export function CloseIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5 5l14 14" />
      <path d="M19 5L5 19" />
    </Icon>
  );
}
