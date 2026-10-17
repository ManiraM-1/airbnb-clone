import { Icon, type IconProps } from "./Icon";

export function CoAlarmIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 5.5h.01" />
      <path d="M12 18.5h.01" />
      <path d="M5.5 12h.01" />
      <path d="M18.5 12h.01" />
    </Icon>
  );
}
