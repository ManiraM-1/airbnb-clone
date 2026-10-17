import { Icon, type IconProps } from "./Icon";

export function WifiIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M2 9a15 15 0 0 1 20 0" />
      <path d="M5 12.5a10 10 0 0 1 14 0" />
      <path d="M8.5 16a5 5 0 0 1 7 0" />
      <path d="M12 19.5h.01" />
    </Icon>
  );
}
