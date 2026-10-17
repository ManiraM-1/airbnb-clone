import { Icon, type IconProps } from "./Icon";

// Communication (SPEC §7.1): rounded speech bubble, tail at the bottom centre.
export function MessageIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4.1 3.4h15.4a1.9 1.9 0 0 1 1.9 1.9v11.9a1.9 1.9 0 0 1-1.9 1.9h-5.25L12 22.5l-2.6-3.4H4.1a1.9 1.9 0 0 1-1.9-1.9V5.3a1.9 1.9 0 0 1 1.9-1.9z" />
    </Icon>
  );
}
