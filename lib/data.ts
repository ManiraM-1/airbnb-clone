import raw from "@/data/listing.json";
import type { Listing } from "./types";

// Assigning to `Listing` makes tsc verify the JSON matches the types.
const listing: Listing = raw;

export function getListing(): Listing {
  return listing;
}
