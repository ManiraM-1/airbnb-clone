import { Icon, type IconProps } from "./Icon";

export function KitchenIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5 3v5a2 2 0 0 0 4 0V3" />
      <path d="M7 3v18" />
      <path d="M17 21V3c-2 1-3 3.5-3 7v3h3" />
    </Icon>
  );
}
