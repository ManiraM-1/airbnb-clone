import { Icon, type IconProps } from "./Icon";

const CENTRES = [4.5, 12, 19.5];

/** 3×3 dot grid ("Show all photos"). Filled dots, no stroke. */
export function GridIcon(props: IconProps) {
  return (
    <Icon fill="currentColor" stroke="none" {...props}>
      {CENTRES.flatMap((cy) => CENTRES.map((cx) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2" />))}
    </Icon>
  );
}
