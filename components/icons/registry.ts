import type { ComponentType } from "react";
import type { IconProps } from "./Icon";
import { CalendarIcon } from "./CalendarIcon";
import { CheckCircleIcon } from "./CheckCircleIcon";
import { DoorIcon } from "./DoorIcon";
import { FanIcon } from "./FanIcon";
import { FirePitIcon } from "./FirePitIcon";
import { KeyIcon } from "./KeyIcon";
import { MapIcon } from "./MapIcon";
import { MessageIcon } from "./MessageIcon";
import { ShieldIcon } from "./ShieldIcon";
import { SprayIcon } from "./SprayIcon";
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
  spray: SprayIcon,
  "check-circle": CheckCircleIcon,
  key: KeyIcon,
  message: MessageIcon,
  map: MapIcon,
  tag: TagIcon,
  // things to know
  calendar: CalendarIcon,
  shield: ShieldIcon,
};

export function getIcon(name: string): ComponentType<IconProps> | undefined {
  return registry[name];
}
