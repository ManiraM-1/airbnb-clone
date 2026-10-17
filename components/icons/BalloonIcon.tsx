import { Icon, type IconProps } from "./Icon";

// "Born in the …" fact (SPEC §7.3): round balloon, knot and short string.
export function BalloonIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 18c-3.6-2.4-7.5-5.2-7.5-8.6a7.5 7.5 0 0 1 15 0c0 3.4-3.9 6.2-7.5 8.6z" />
      <path d="M10.6 20.4h2.8L12 18z" />
      <path d="M12 20.4V23" />
    </Icon>
  );
}
