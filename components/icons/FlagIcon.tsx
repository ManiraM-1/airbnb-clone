import { Icon, type IconProps } from "./Icon";

export function FlagIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5 21V3.5" />
      <path d="M5 4h13l-3 4.5 3 4.5H5" />
    </Icon>
  );
}
