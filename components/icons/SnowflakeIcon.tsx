import { Icon, type IconProps } from "./Icon";

export function SnowflakeIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 2v20" />
      <path d="M3.3 7l17.4 10" />
      <path d="M20.7 7L3.3 17" />
      <path d="M9 3.5l3 2 3-2" />
      <path d="M9 20.5l3-2 3 2" />
    </Icon>
  );
}
