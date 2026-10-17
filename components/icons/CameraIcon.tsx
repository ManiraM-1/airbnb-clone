import { Icon, type IconProps } from "./Icon";

export function CameraIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M2 8l14-4 2 7-14 4z" />
      <path d="M18 9l3-1v4l-3 1" />
      <path d="M9 13.5V18H4" />
      <path d="M4 15v6" />
    </Icon>
  );
}
