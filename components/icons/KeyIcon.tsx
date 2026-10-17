import { Icon, type IconProps } from "./Icon";

export function KeyIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="8" cy="15" r="4.5" />
      <path d="M11.2 11.8L20 3" />
      <path d="M17 6l3 3" />
      <path d="M14.5 8.5l2 2" />
    </Icon>
  );
}
