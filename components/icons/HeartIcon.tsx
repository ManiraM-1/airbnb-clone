import { Icon, type IconProps } from "./Icon";

/** Outline heart filling the full 24-unit width. */
export function HeartIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 21.45C9 18.9 1.5 13.2 1.5 7.9 1.5 4.6 3.9 2.25 6.6 2.25c2.3 0 4.3 1.15 5.4 2.65 1.1-1.5 3.1-2.65 5.4-2.65 2.7 0 5.1 2.35 5.1 5.65 0 5.3-7.5 11-10.5 13.55z" />
    </Icon>
  );
}
