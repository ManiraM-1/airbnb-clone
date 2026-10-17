import { Icon, type IconProps } from "./Icon";

export function ShieldIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 2.5l8 3v6c0 5-3.4 8.8-8 10-4.6-1.2-8-5-8-10v-6z" />
      <path d="M12 2.5v19" />
    </Icon>
  );
}
