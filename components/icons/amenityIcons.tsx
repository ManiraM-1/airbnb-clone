// Amenity glyphs (SPEC §5.7, §10.1): our own line drawings on the shared 24-unit Icon frame,
// drawn from the shapes visible in ref-full.png / ref-amenities.png (1.5px strokes).
// AMENITY_ICON_BY_NAME maps every item in listing.json → amenitiesAll (and the preview keys)
// to a glyph.
import type { ComponentType, ReactNode } from "react";
import { CalendarIcon } from "./CalendarIcon";
import { DoorIcon } from "./DoorIcon";
import { FanIcon } from "./FanIcon";
import { Icon, type IconProps } from "./Icon";
import { KeyIcon } from "./KeyIcon";
import { SprayIcon } from "./SprayIcon";

const STROKE = 1.5;

function glyph(children: ReactNode): ComponentType<IconProps> {
  function AmenityGlyph(props: IconProps) {
    return (
      <Icon strokeWidth={STROKE} {...props}>
        {children}
      </Icon>
    );
  }
  return AmenityGlyph;
}

function reuse(Component: ComponentType<IconProps>): ComponentType<IconProps> {
  function ReusedGlyph(props: IconProps) {
    return <Component strokeWidth={STROKE} {...props} />;
  }
  return ReusedGlyph;
}

const WAVE = "c1.7 0 1.7-1 3.3-1s1.7 1 3.4 1 1.6-1 3.3-1 1.7 1 3.3 1 1.7-1 3.4-1 1.6 1 3.3 1";

export const AMENITY_ICONS = {
  // Preview (§5.7)
  kitchen: glyph(
    <>
      <path d="M4.5 21.5v-19c2 1.6 3 4.2 3 7.6v3.4h-3" />
      <path d="M12 2.5v12.5" />
      <circle cx="12" cy="18" r="2.5" />
      <path d="M19.5 11.5v10" />
      <ellipse cx="19.5" cy="7" rx="2" ry="4.5" />
    </>,
  ),
  wifi: glyph(
    <>
      <path d="M2 9.5a14.5 14.5 0 0 1 20 0" />
      <path d="M5.3 13a9.6 9.6 0 0 1 13.4 0" />
      <path d="M8.6 16.4a4.9 4.9 0 0 1 6.8 0" />
      <circle cx="12" cy="19.7" r="1.3" />
    </>,
  ),
  workspace: glyph(
    <>
      <path d="M2.5 13h19" />
      <path d="M4.5 13v8.5" />
      <path d="M19.5 13v8.5" />
      <path d="M4.5 19h15" />
      <path d="M6.5 13v-3.5h3V13" />
      <path d="M7.5 9.5l1-2.5" />
      <path d="M14.5 6.5l1-4h3l1 4z" />
      <path d="M17 6.5V13" />
    </>,
  ),
  parking: glyph(
    <>
      <path d="M3.5 13.5l2-6.4c.3-1 1.1-1.6 2.1-1.6h8.8c1 0 1.8.6 2.1 1.6l2 6.4v5h-17z" />
      <path d="M5.5 18.5v2.5h2.5v-2.5" />
      <path d="M16 18.5v2.5h2.5v-2.5" />
      <path d="M3.5 10.5h-2" />
      <path d="M20.5 10.5h2" />
      <path d="M3.5 13.5h17" />
      <path d="M9.5 16h5" />
    </>,
  ),
  pool: glyph(
    <>
      <path d="M2 6.5h20" />
      <path d="M10 11.5V4a1.5 1.5 0 0 1 3 0" />
      <path d="M15 11.5V4a1.5 1.5 0 0 1 3 0" />
      <path d="M10 9h5" />
      <path d={`M2 13.5${WAVE}`} />
      <path d={`M2 17${WAVE}`} />
      <path d={`M2 20.5${WAVE}`} />
    </>,
  ),
  hottub: glyph(
    <>
      <path d="M2.5 11.5h19V21.5h-19z" />
      <circle cx="8" cy="5" r="2.3" />
      <path d="M4.5 11.5c0-2 1.6-3.5 3.5-3.5s3.5 1.5 3.5 3.5" />
      <path d="M14 10l3.5-5.5" />
      <path d="M17.5 10L21 4.5" />
      <path d="M11 15l4 2" />
    </>,
  ),
  pets: glyph(
    <>
      <circle cx="5" cy="9.5" r="2" />
      <circle cx="9.5" cy="4.5" r="2" />
      <circle cx="14.5" cy="4.5" r="2" />
      <circle cx="19" cy="9.5" r="2" />
      <path d="M12 11.5c-2.8 0-5.5 4.2-5.5 6.6a2.4 2.4 0 0 0 3.4 2.2 5.2 5.2 0 0 1 4.2 0 2.4 2.4 0 0 0 3.4-2.2c0-2.4-2.7-6.6-5.5-6.6z" />
    </>,
  ),
  camera: glyph(
    <>
      <path d="M2.5 3.5h14v8.5h-14z" />
      <path d="M16.5 6l5-2v8.5l-5-2" />
      <circle cx="9.5" cy="15.5" r="2.5" />
      <path d="M2.5 12v9" />
      <path d="M2.5 18.5h4.5l1-1" />
      <path d="M5.5 6.5h.01" />
    </>,
  ),
  "co-alarm": glyph(
    <>
      <rect x="2.5" y="2.5" width="19" height="19" rx="3" />
      <path d="M9 9h.01" />
      <path d="M12 12h.01" />
      <path d="M15 15h.01" />
      <path d="M15 9h.01" />
      <path d="M9 15h.01" />
    </>,
  ),
  "smoke-alarm": glyph(
    <>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M9 9h.01" />
      <path d="M12 12h.01" />
      <path d="M15 15h.01" />
      <path d="M15 9h.01" />
      <path d="M9 15h.01" />
    </>,
  ),

  // Bathroom
  hairdryer: glyph(
    <>
      <circle cx="8" cy="8.5" r="5.5" />
      <circle cx="8" cy="8.5" r="2" />
      <path d="M12.2 5L21.5 3v11l-9.3-2" />
      <path d="M6.5 13.8L8 19h3l-1.2-5" />
      <path d="M9.5 19v1.5c0 .8-.7 1.5-1.5 1.5H4" />
    </>,
  ),
  cleaning: glyph(
    <>
      <path d="M5 10h14v11.5H5z" />
      <path d="M5 15.5h14" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      <path d="M10.5 10V7.5h3V10" />
    </>,
  ),
  shampoo: glyph(
    <>
      <path d="M9 2.5h6" />
      <path d="M12 2.5v3" />
      <path d="M9.5 5.5h5V8" />
      <rect x="7.5" y="8" width="9" height="13.5" rx="2" />
      <path d="M7.5 12.5h9" />
      <path d="M7.5 17h9" />
    </>,
  ),
  hotwater: glyph(
    <>
      <path d="M3 12h18v4.5a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5z" />
      <path d="M3 15c2 0 2-1 4.5-1s2.5 1 4.5 1 2.5-1 4.5-1 2 1 4.5 1" />
      <path d="M4.5 12V4.5h3V6" />
      <path d="M10 9.5l2-5" />
      <path d="M13.5 9.5l2-5" />
      <path d="M17 9.5l2-5" />
    </>,
  ),
  showergel: glyph(
    <>
      <path d="M7.5 2.5h5" />
      <path d="M10 2.5v3" />
      <path d="M8 5.5h4V8" />
      <rect x="5.5" y="8" width="9" height="13.5" rx="2.5" />
      <path d="M5.5 13c2.5 1 5-1 9 0" />
      <circle cx="19" cy="5.5" r="1.5" />
      <circle cx="19.5" cy="12" r="1.2" />
    </>,
  ),

  // Bedroom and laundry
  washer: glyph(
    <>
      <rect x="2.5" y="1.5" width="19.7" height="20.7" rx="2" />
      <circle cx="12.5" cy="12" r="6" />
      <path d="M6.5 11c2-1.5 4 0 6 1.5s4 1.5 6 0" />
      <path d="M6 4.8h.01" />
    </>,
  ),
  hanger: glyph(
    <>
      <path d="M9.5 4a2.5 2.5 0 1 1 2.5 2.5V10.5" />
      <path d="M12 10.5L1.6 19a.8.8 0 0 0 .5 1.5h19.8a.8.8 0 0 0 .5-1.5z" />
    </>,
  ),
  linen: glyph(
    <>
      <path d="M3.5 3.5h11l6 6v12h-17z" />
      <path d="M14.5 3.5v6h6" />
      <path d="M3.5 16h17" />
      <path d="M3.5 18.5h17" />
    </>,
  ),
  blinds: glyph(
    <>
      <path d="M2 3.5h20" />
      <path d="M3.5 3.5v14h17v-14" />
      <path d="M12 17.5v2" />
      <circle cx="12" cy="20.7" r="1.2" />
    </>,
  ),
  iron: glyph(
    <>
      <path d="M2.5 4h9c1.5 0 2.8 1.2 3.3 2.7" />
      <path d="M2.5 18h19c0-6-4.2-10.5-9.5-10.5h-9.5z" />
      <path d="M2.5 15h18.5" />
      <path d="M8 21.5h.01" />
      <path d="M12 21.5h.01" />
      <path d="M16 21.5h.01" />
    </>,
  ),
  wardrobe: glyph(
    <>
      <rect x="3.5" y="2.5" width="17" height="17.5" rx="1" />
      <path d="M12 2.5V20" />
      <path d="M10 10v2.5" />
      <path d="M14 10v2.5" />
      <path d="M5.5 20v1.5" />
      <path d="M18.5 20v1.5" />
    </>,
  ),
  cot: glyph(
    <>
      <path d="M3 5.5v16" />
      <path d="M21 5.5v16" />
      <path d="M3 9.5h18" />
      <path d="M3 18h18" />
      <path d="M7.5 9.5V18" />
      <path d="M12 9.5V18" />
      <path d="M16.5 9.5V18" />
    </>,
  ),

  // Entertainment, heating and cooling
  tv: glyph(
    <>
      <rect x="2" y="4" width="20" height="13.5" rx="1.5" />
      <path d="M12 17.5V21" />
      <path d="M8 21h8" />
    </>,
  ),
  aircon: glyph(
    <>
      <rect x="2" y="4" width="20" height="9.5" rx="1.5" />
      <path d="M5.5 10.5h13" />
      <path d="M7 16.5v3" />
      <path d="M12 16.5v4.5" />
      <path d="M17 16.5v3" />
    </>,
  ),
  fan: reuse(FanIcon),

  // Kitchen and dining
  fridge: glyph(
    <>
      <rect x="5" y="2" width="14" height="20" rx="1.5" />
      <path d="M5 9.5h14" />
      <path d="M8 5v2" />
      <path d="M8 12.5v3" />
    </>,
  ),
  freezer: glyph(
    <>
      <rect x="5" y="2" width="14" height="20" rx="1.5" />
      <path d="M12 8v9" />
      <path d="M8.1 10.25l7.8 4.5" />
      <path d="M15.9 10.25l-7.8 4.5" />
    </>,
  ),
  microwave: glyph(
    <>
      <rect x="2" y="4.5" width="20" height="15" rx="1.5" />
      <rect x="4.5" y="7" width="11" height="10" rx="1" />
      <path d="M18.5 8v.01" />
      <path d="M18.5 11v.01" />
      <path d="M18.5 14.5v2" />
    </>,
  ),
  cooking: glyph(
    <>
      <path d="M3 11h15v4.5a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5z" />
      <path d="M18 12.5h3.5" />
      <path d="M7 3.5v4" />
      <path d="M10.5 3.5v4" />
      <path d="M14 3.5v4" />
    </>,
  ),
  crockery: glyph(
    <>
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="3" />
      <path d="M2.5 3v18" />
      <path d="M21.5 3v18" />
      <path d="M1.5 3v4.5a1 1 0 0 0 2 0V3" />
    </>,
  ),
  kettle: glyph(
    <>
      <path d="M5.5 21.5h11l-1.5-12h-8z" />
      <path d="M7 9.5c0-2.5 1.8-4.5 4-4.5s4 2 4 4.5" />
      <path d="M15.6 12h1.9a2.5 2.5 0 0 1 0 5h-1.2" />
      <path d="M7 12.5L3.5 9" />
      <path d="M11 3v2" />
    </>,
  ),
  coffee: glyph(
    <>
      <path d="M3 9.5h14v6a6 6 0 0 1-6 6H9a6 6 0 0 1-6-6z" />
      <path d="M17 11h1.5a2.5 2.5 0 0 1 0 5H17" />
      <path d="M7 2.5c-1 1.2 1 2.3 0 3.5" />
      <path d="M11 2.5c-1 1.2 1 2.3 0 3.5" />
    </>,
  ),
  wineglasses: glyph(
    <>
      <path d="M4 2.5h6l-.3 5.2a2.7 2.7 0 0 1-5.4 0z" />
      <path d="M7 10.5v10" />
      <path d="M4.5 21h5" />
      <path d="M14 2.5h6l-.3 5.2a2.7 2.7 0 0 1-5.4 0z" />
      <path d="M17 10.5v10" />
      <path d="M14.5 21h5" />
    </>,
  ),
  toaster: glyph(
    <>
      <path d="M3 9.5a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v10H3z" />
      <path d="M8 5.5v-2" />
      <path d="M16 5.5v-2" />
      <path d="M21 13h1.5" />
      <path d="M3 21.5h18" />
    </>,
  ),
  blender: glyph(
    <>
      <path d="M6.5 2.5h11l-1.5 11h-8z" />
      <path d="M17.5 5h2v5.5h-2.7" />
      <path d="M7.5 13.5L6 21.5h12l-1.5-8" />
      <path d="M12 17.5h.01" />
    </>,
  ),
  cooker: glyph(
    <>
      <rect x="3" y="2.5" width="18" height="19" rx="1.5" />
      <path d="M3 8h18" />
      <path d="M7 5.25h.01" />
      <path d="M11 5.25h.01" />
      <rect x="6" y="11" width="12" height="7.5" rx="1" />
    </>,
  ),

  // Outdoor, facilities, services
  patio: glyph(
    <>
      <path d="M2 21.5h20" />
      <path d="M3.5 21.5V11h17v10.5" />
      <path d="M3.5 14h17" />
      <path d="M7.5 14v7.5" />
      <path d="M12 14v7.5" />
      <path d="M16.5 14v7.5" />
      <path d="M3.5 7.5L12 2.5l8.5 5" />
    </>,
  ),
  outdoordining: glyph(
    <>
      <path d="M12 2.5a8 8 0 0 1 8 6.5H4a8 8 0 0 1 8-6.5z" />
      <path d="M12 9v12.5" />
      <path d="M6.5 14h11" />
      <path d="M8 14l-1.5 7.5" />
      <path d="M16 14l1.5 7.5" />
    </>,
  ),
  gym: glyph(
    <>
      <path d="M2 12h20" />
      <rect x="4" y="7" width="3" height="10" rx="1" />
      <rect x="17" y="7" width="3" height="10" rx="1" />
      <path d="M7 9v6" />
      <path d="M17 9v6" />
    </>,
  ),
  door: reuse(DoorIcon),
  key: reuse(KeyIcon),
  calendar: reuse(CalendarIcon),
  spray: reuse(SprayIcon),
} satisfies Record<string, ComponentType<IconProps>>;

export type AmenityIconKey = keyof typeof AMENITY_ICONS;

/** Every amenity name in listing.json → amenitiesAll, mapped to its glyph. */
export const AMENITY_ICON_BY_NAME: Record<string, AmenityIconKey> = {
  Hairdryer: "hairdryer",
  "Cleaning products": "cleaning",
  Shampoo: "shampoo",
  "Hot water": "hotwater",
  "Shower gel": "showergel",
  "Washing machine": "washer",
  Hangers: "hanger",
  "Bed linen": "linen",
  "Room-darkening blinds": "blinds",
  Iron: "iron",
  "Clothes storage": "wardrobe",
  Cot: "cot",
  TV: "tv",
  "Air conditioning": "aircon",
  "Ceiling fan": "fan",
  "Exterior security cameras on property": "camera",
  "Carbon monoxide alarm": "co-alarm",
  "Smoke alarm": "smoke-alarm",
  Wifi: "wifi",
  "Dedicated workspace": "workspace",
  Kitchen: "kitchen",
  Fridge: "fridge",
  Freezer: "freezer",
  Microwave: "microwave",
  "Cooking basics": "cooking",
  "Crockery and cutlery": "crockery",
  Kettle: "kettle",
  Coffee: "coffee",
  "Wine glasses": "wineglasses",
  Toaster: "toaster",
  Blender: "blender",
  Cooker: "cooker",
  "Private entrance": "door",
  "Patio or balcony": "patio",
  "Outdoor dining area": "outdoordining",
  "Free parking on premises": "parking",
  Pool: "pool",
  "Hot tub": "hottub",
  Gym: "gym",
  "Pets allowed": "pets",
  "Cleaning available during stay": "spray",
  "Long-term stays allowed": "calendar",
  "Self check-in": "key",
};

/** Icon for an amenity, looked up by preview key ("kitchen") or by item name ("Kitchen"). */
export function getAmenityIcon(keyOrName: string): ComponentType<IconProps> | undefined {
  const key = (AMENITY_ICON_BY_NAME[keyOrName] ?? keyOrName) as AmenityIconKey;
  return AMENITY_ICONS[key];
}
