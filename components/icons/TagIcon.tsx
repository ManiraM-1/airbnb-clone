import { Icon, type IconProps } from "./Icon";

export function TagIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3 3h8l10 10-8 8L3 11z" />
      <circle cx="7.5" cy="7.5" r="1.5" />
    </Icon>
  );
}
