import type { ComponentType } from "react";
import type { IconProps } from "./Icon";
import { CalendarCancelIcon } from "./CalendarCancelIcon";
import { CheckCircleIcon } from "./CheckCircleIcon";
import { DoorIcon } from "./DoorIcon";
import { FanIcon } from "./FanIcon";
import { FirePitIcon } from "./FirePitIcon";
import { CheckInKeyIcon } from "./CheckInKeyIcon";
import { MapIcon } from "./MapIcon";
import { MessageIcon } from "./MessageIcon";
import { ShieldIcon } from "./ShieldIcon";
import { SprayBottleIcon } from "./SprayBottleIcon";
import { TagIcon } from "./TagIcon";

/** Maps the `icon` keys used in data/listing.json to icon components. */
const registry: Record<string, ComponentType<IconProps>> = {
  // highlights
  // Data keys kept as-is; glyphs follow the reference: "outdoor" is a fire pit,
  // "snowflake" (Designed for staying cool) is a ceiling fan.
  outdoor: FirePitIcon,
  snowflake: FanIcon,
  door: DoorIcon,
  // review categories (amenity icons live in amenityIcons.tsx)
  spray: SprayBottleIcon,
  "check-circle": CheckCircleIcon,
  key: CheckInKeyIcon,
  message: MessageIcon,
  map: MapIcon,
  tag: TagIcon,
  // things to know
  calendar: CalendarCancelIcon,
  shield: ShieldIcon,
};

export function getIcon(name: string): ComponentType<IconProps> | undefined {
  return registry[name];
}
