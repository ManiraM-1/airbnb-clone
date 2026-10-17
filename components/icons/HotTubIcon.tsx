import { Icon, type IconProps } from "./Icon";

export function HotTubIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3 12h18v3a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5z" />
      <path d="M8 3c-1 1.5 1 2.5 0 5" />
      <path d="M12 3c-1 1.5 1 2.5 0 5" />
      <path d="M16 3c-1 1.5 1 2.5 0 5" />
    </Icon>
  );
}
