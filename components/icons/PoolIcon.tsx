import { Icon, type IconProps } from "./Icon";

export function PoolIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M8 15V5a2 2 0 0 1 4 0" />
      <path d="M16 15V5a2 2 0 0 1 4 0" />
      <path d="M8 9h8" />
      <path d="M8 13h8" />
      <path d="M2 19c2 0 2-1.5 4-1.5s2 1.5 4 1.5 2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 4-1.5" />
    </Icon>
  );
}
