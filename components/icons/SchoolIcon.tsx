import { Icon, type IconProps } from "./Icon";

export function SchoolIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M2 9l10-5 10 5-10 5z" />
      <path d="M6 11v5c3 2 9 2 12 0v-5" />
      <path d="M22 9v5" />
    </Icon>
  );
}
