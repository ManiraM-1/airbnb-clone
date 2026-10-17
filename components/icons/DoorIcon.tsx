import { Icon, type IconProps } from "./Icon";

/** Door in its frame, with handle and floor line ("Self check-in" highlight). */
export function DoorIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5 21.5v-20h13.25v20" />
      <path d="M15.25 1.5v20" />
      <path d="M3 21.5h18" />
      <path d="M12.5 11.5h1" />
    </Icon>
  );
}
