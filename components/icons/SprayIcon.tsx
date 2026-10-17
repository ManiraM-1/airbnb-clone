import { Icon, type IconProps } from "./Icon";

export function SprayIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M8 21V12a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v9z" />
      <path d="M10 10V6h4l2-2" />
      <path d="M19 3h.01" />
      <path d="M21 6h.01" />
      <path d="M19 8h.01" />
    </Icon>
  );
}
