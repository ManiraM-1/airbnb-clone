import { Icon, type IconProps } from "./Icon";

export function CloseIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3.75 3.75l16.5 16.5" />
      <path d="M20.25 3.75L3.75 20.25" />
    </Icon>
  );
}
