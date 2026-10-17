import { Icon, type IconProps } from "./Icon";

export function PetsIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="5.5" cy="10" r="1.8" />
      <circle cx="9.5" cy="5.5" r="1.8" />
      <circle cx="14.5" cy="5.5" r="1.8" />
      <circle cx="18.5" cy="10" r="1.8" />
      <path d="M12 11c-3 0-6 4.5-6 7a2.5 2.5 0 0 0 3.5 2.3c1.6-.7 3.4-.7 5 0A2.5 2.5 0 0 0 18 18c0-2.5-3-7-6-7z" />
    </Icon>
  );
}
