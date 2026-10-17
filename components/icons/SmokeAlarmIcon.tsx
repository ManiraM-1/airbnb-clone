import { Icon, type IconProps } from "./Icon";

export function SmokeAlarmIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3 5h18" />
      <path d="M5 5v2a7 7 0 0 0 14 0V5" />
      <path d="M9 18c-1 1 1 2 0 3" />
      <path d="M15 18c-1 1 1 2 0 3" />
    </Icon>
  );
}
