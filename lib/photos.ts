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
