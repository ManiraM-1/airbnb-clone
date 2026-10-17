import { Icon, type IconProps } from "./Icon";

export function WorkspaceIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="4" y="5" width="16" height="11" rx="1" />
      <path d="M2 19h20" />
    </Icon>
  );
}
