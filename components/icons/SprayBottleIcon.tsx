import { Icon, type IconProps } from "./Icon";

// Cleanliness (SPEC §7.1), traced from ref-full.png at 10×: trigger spray bottle, liquid line, mist dots.
export function SprayBottleIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6.4 1.1h11.2v3.4h-4.1l-2.25 1.9h-3L5.6 3.4c-.4-1 0-2 .8-2.3z" />
      <path d="M14.25 4.9l1.5 3" />
      <path d="M8.25 6.4v3.7l-4.5 4.5v9h12v-9l-4.5-4.5V6.4" />
      <path d="M3.75 15.75c3-.75 4.5 2.25 6.75 2.65s3.75-.4 5.25-.4" />
      <path d="M20.25 2.6h.01" />
      <path d="M22.1 1.1h.01" />
      <path d="M22.1 4.5h.01" />
    </Icon>
  );
}
