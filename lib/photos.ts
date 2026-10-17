import type { Listing } from "./types";

export interface TourPhoto {
  /** 0-based position across all tour photos (0–42). */
  index: number;
  /** Index of the room in `listing.tour`. */
  roomIndex: number;
  room: string;
  src: string;
}

/** Flattens the tour rooms into one ordered list of photos. */
export function flattenTour(tour: Listing["tour"]): TourPhoto[] {
  return tour.flatMap((room, roomIndex) =>
    room.photos.map((src) => ({ roomIndex, room: room.room, src })),
  ).map((photo, index) => ({ index, ...photo }));
}

/** For each hero image, the index of the same photo in the flattened tour. */
export function heroTourIndexes(hero: Listing["hero"], photos: TourPhoto[]): number[] {
  return hero.map((src) => {
    const index = photos.findIndex((photo) => photo.src === src);
    if (index === -1) throw new Error(`Hero image not found in tour: ${src}`);
    return index;
  });
}

/** Value for the `modalItem` URL param (SPEC §9). */
export function modalItemFor(index: number): number {
  return 1000 + index;
}

export interface TourRoomLayout {
  roomIndex: number;
  room: string;
  features: string[];
  /** Photo rows from the room's `layout` string: one full-width photo or two side by side. */
  rows: TourPhoto[][];
}

/** Splits each room's photos into rows following its `layout` string (SPEC §8.3). */
export function tourLayout(tour: Listing["tour"]): TourRoomLayout[] {
  const photos = flattenTour(tour);
  let next = 0;
  return tour.map((room, roomIndex) => {
    const rows = [...room.layout].map((cell) => {
      const count = cell === "2" ? 2 : 1;
      const row = photos.slice(next, next + count);
      next += count;
      return row;
    });
    const placed = rows.flat();
    if (placed.length !== room.photos.length || placed.some((photo) => photo.roomIndex !== roomIndex)) {
      throw new Error(`Tour layout "${room.layout}" does not fit the ${room.photos.length} photos of ${room.room}`);
    }
    return { roomIndex, room: room.room, features: room.features, rows };
  });
}
