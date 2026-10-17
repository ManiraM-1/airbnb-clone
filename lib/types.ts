// Types for data/listing.json. Keep in sync with the JSON; lib/data.ts type-checks it on import.

/** Coloured letter avatar used when a person has no photo. */
export interface LetterAvatar {
  letter: string;
  bg: string;
  color: string;
}

/** Either an image path or a letter avatar. */
export type Avatar = string | LetterAvatar;

export interface Overview {
  heading: string;
  details: string[];
}

export interface GuestFavourite {
  text: string;
  rating: number;
  reviewCount: number;
}

export interface Host {
  name: string;
  avatar: string;
  yearsHosting: number;
  reviews: string;
  rating: string;
  facts: string[];
  responseRate: string;
  responseTime: string;
}

export interface Highlight {
  icon: string;
  title: string;
  text: string;
}

export interface SleepArea {
  title: string;
  text: string;
  image: string;
}

export interface AmenityPreview {
  name: string;
  icon: string;
  available: boolean;
}

export interface AmenityCategory {
  category: string;
  items: string[];
}

export interface Discount {
  text: string;
  link: string;
}

export interface Booking {
  location: string;
  /** ISO date, YYYY-MM-DD */
  checkIn: string;
  /** ISO date, YYYY-MM-DD */
  checkOut: string;
  nights: number;
  price: string;
  guests: string;
  cancellationBefore: string;
  /** YYYY-MM */
  calendarMonths: string[];
  discount: Discount;
}

export type StarLevel = "1" | "2" | "3" | "4" | "5";

export interface ReviewCategory {
  name: string;
  score: string;
  icon: string;
}

export interface ReviewTopic {
  name: string;
  count: number;
  icon: string;
}

export interface Review {
  name: string;
  tenure: string;
  date: string;
  avatar: Avatar;
  text: string;
}

export interface Reviews {
  rating: number;
  count: number;
  /** Share of reviews per star level, 0–1. */
  distribution: Record<StarLevel, number>;
  categories: ReviewCategory[];
  topics: ReviewTopic[];
  items: Review[];
}

export interface ListingLocation {
  name: string;
  note: string;
  highlights: string;
}

export interface CoHost {
  name: string;
  avatar: Avatar;
}

export interface ThingToKnow {
  icon: string;
  title: string;
  lines: string[];
}

export interface Stay {
  title: string;
  image: string;
  price: string;
  rating: string;
}

export interface TourRoom {
  room: string;
  features: string[];
  /** Row pattern: "1" = one full-width photo, "2" = two side by side. */
  layout: string;
  photos: string[];
}

export interface ListingAssets {
  font: string;
  ui: string[];
}

export interface Listing {
  title: string;
  pageTitle: string;
  overview: Overview;
  guestFavourite: GuestFavourite;
  host: Host;
  highlights: Highlight[];
  description: string;
  sleep: SleepArea[];
  amenitiesPreview: AmenityPreview[];
  amenitiesTotal: number;
  amenitiesAll: AmenityCategory[];
  booking: Booking;
  reviews: Reviews;
  location: ListingLocation;
  cohosts: CoHost[];
  thingsToKnow: ThingToKnow[];
  moreStays: Stay[];
  hero: string[];
  tour: TourRoom[];
  assets: ListingAssets;
}
