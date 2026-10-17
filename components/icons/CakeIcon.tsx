import { Icon, type IconProps } from "./Icon";

export function CakeIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 21h16" />
      <path d="M5 21v-8h14v8" />
      <path d="M5 16c2 1 3-1 4.7 0s3 1 4.6 0 3-1 4.7 0" />
      <path d="M12 13V9" />
      <path d="M12 6.5c-.8-1-.8-2.2 0-3.5.8 1.3.8 2.5 0 3.5z" />
    </Icon>
  );
}
