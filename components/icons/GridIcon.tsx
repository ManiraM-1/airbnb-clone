import { Icon, type IconProps } from "./Icon";

/** 3×3 dot grid ("Show all photos"). Filled dots, no stroke. */
export function GridIcon(props: IconProps) {
  return (
    <Icon fill="currentColor" stroke="none" {...props}>
      <circle cx="4" cy="4" r="2" />
      <circle cx="12" cy="4" r="2" />
      <circle cx="20" cy="4" r="2" />
      <circle cx="4" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="20" cy="12" r="2" />
      <circle cx="4" cy="20" r="2" />
      <circle cx="12" cy="20" r="2" />
      <circle cx="20" cy="20" r="2" />
    </Icon>
  );
}
