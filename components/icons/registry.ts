import type { ComponentType } from "react";
import type { IconProps } from "./Icon";
import { CalendarIcon } from "./CalendarIcon";
import { CameraIcon } from "./CameraIcon";
import { CheckCircleIcon } from "./CheckCircleIcon";
import { CoAlarmIcon } from "./CoAlarmIcon";
import { DoorIcon } from "./DoorIcon";
import { HotTubIcon } from "./HotTubIcon";
import { KeyIcon } from "./KeyIcon";
import { KitchenIcon } from "./KitchenIcon";
import { MapIcon } from "./MapIcon";
import { MessageIcon } from "./MessageIcon";
import { OutdoorIcon } from "./OutdoorIcon";
import { ParkingIcon } from "./ParkingIcon";
import { PetsIcon } from "./PetsIcon";
import { PoolIcon } from "./PoolIcon";
import { ShieldIcon } from "./ShieldIcon";
import { SmokeAlarmIcon } from "./SmokeAlarmIcon";
import { SnowflakeIcon } from "./SnowflakeIcon";
import { SprayIcon } from "./SprayIcon";
import { TagIcon } from "./TagIcon";
import { WifiIcon } from "./WifiIcon";
import { WorkspaceIcon } from "./WorkspaceIcon";

/** Maps the `icon` keys used in data/listing.json to icon components. */
const registry: Record<string, ComponentType<IconProps>> = {
  // highlights
  outdoor: OutdoorIcon,
  snowflake: SnowflakeIcon,
  door: DoorIcon,
  // amenities
  kitchen: KitchenIcon,
  wifi: WifiIcon,
  workspace: WorkspaceIcon,
  parking: ParkingIcon,
  pool: PoolIcon,
  hottub: HotTubIcon,
  pets: PetsIcon,
  camera: CameraIcon,
  "co-alarm": CoAlarmIcon,
  "smoke-alarm": SmokeAlarmIcon,
  // review categories
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
