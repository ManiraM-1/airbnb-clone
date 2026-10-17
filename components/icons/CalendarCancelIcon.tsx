import { Icon, type IconProps } from "./Icon";

// Cancellation policy (SPEC §7.4): calendar with an X.
export function CalendarCancelIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18" />
      <path d="M8 3v4" />
      <path d="M16 3v4" />
      <path d="M9.5 13l5 5" />
      <path d="M14.5 13l-5 5" />
    </Icon>
  );
}
