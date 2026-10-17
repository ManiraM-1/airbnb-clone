"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { Header } from "@/components/layout/Header";
import { StickyNav } from "@/components/layout/StickyNav";
import { Amenities } from "@/components/listing/Amenities";
import { BookingSidebar } from "@/components/listing/BookingSidebar";
import { Calendar } from "@/components/listing/Calendar";
import { Description } from "@/components/listing/Description";
import { GuestFavourite } from "@/components/listing/GuestFavourite";
import { HeroGallery } from "@/components/listing/HeroGallery";
import { Highlights } from "@/components/listing/Highlights";
import { HostRow } from "@/components/listing/HostRow";
import { Location } from "@/components/listing/Location";
import { MeetHost } from "@/components/listing/MeetHost";
import { MoreStays } from "@/components/listing/MoreStays";
import { Overview } from "@/components/listing/Overview";
import { Reviews } from "@/components/listing/Reviews";
import { Sleep } from "@/components/listing/Sleep";
import { ThingsToKnow } from "@/components/listing/ThingsToKnow";
import { TitleRow } from "@/components/listing/TitleRow";
import { AmenitiesModal } from "@/components/overlays/AmenitiesModal";
import { PhotoTour } from "@/components/overlays/PhotoTour";
import { PhotoViewer } from "@/components/overlays/PhotoViewer";
import { MODAL_PHOTO_TOUR, useModalUrl, writeModalUrl } from "@/hooks/useModalUrl";
import { useToast } from "@/hooks/useToast";
import type { Listing } from "@/lib/types";
import styles from "./ListingPage.module.css";

const SHARE_TOAST = "Share options";
const RESERVE_TOAST = "You won't be charged yet";

export interface ListingPageProps {
  listing: Listing;
}

// Page skeleton (SPEC §1). Owns overlay state and page-level callbacks.
export function ListingPage({ listing }: ListingPageProps) {
  const showToast = useToast();

  // Photo tour (SPEC §8): open while the URL says so; `tourStart` is the photo it was opened from.
  const { modal } = useModalUrl();
  const tourOpen = modal === MODAL_PHOTO_TOUR;
  const [tourStart, setTourStart] = useState<number | null>(null);
  const handleOpenTour = useCallback((photoIndex?: number) => {
    setTourStart(photoIndex ?? null);
    writeModalUrl({ modal: MODAL_PHOTO_TOUR });
  }, []);
  const closeTour = useCallback(() => writeModalUrl({ modal: null, modalItem: null }), []);
  // Opens the Photo Viewer (SPEC §9), built next.
  const openViewer = useCallback((index: number) => {
    void index;
  }, []);

  const heroRef = useRef<HTMLElement>(null);

  const handleShare = useCallback(() => showToast(SHARE_TOAST), [showToast]);
  const handleReserve = useCallback(() => showToast(RESERVE_TOAST), [showToast]);

  const [amenitiesOpen, setAmenitiesOpen] = useState(false);
  const openAmenities = useCallback(() => setAmenitiesOpen(true), []);
  const closeAmenities = useCallback(() => setAmenitiesOpen(false), []);
  const unavailableAmenities = useMemo(
    () => new Set(listing.amenitiesPreview.filter((a) => !a.available).map((a) => a.name)),
    [listing.amenitiesPreview],
  );

  return (
    <>
      <Header />
      <main>
        <div className={styles.container}>
          <TitleRow title={listing.title} onShare={handleShare} />
          <HeroGallery
            ref={heroRef}
            title={listing.title}
            hero={listing.hero}
            tour={listing.tour}
            onOpenTour={handleOpenTour}
          />
          <div className={styles.grid}>
            <div className={styles.left}>
              <Overview overview={listing.overview} />
              <GuestFavourite guestFavourite={listing.guestFavourite} />
              <HostRow host={listing.host} />
              <Highlights highlights={listing.highlights} />
              <Description description={listing.description} />
              <Sleep sleep={listing.sleep} />
              <Amenities
                amenities={listing.amenitiesPreview}
                total={listing.amenitiesTotal}
                onShowAll={openAmenities}
              />
              <Calendar booking={listing.booking} />
            </div>
            <BookingSidebar booking={listing.booking} onReserve={handleReserve} />
          </div>
          <div className={styles.bottom}>
            <Reviews reviews={listing.reviews} />
            <Location location={listing.location} />
            <MeetHost host={listing.host} cohosts={listing.cohosts} />
            <ThingsToKnow items={listing.thingsToKnow} />
            <MoreStays stays={listing.moreStays} />
          </div>
        </div>
      </main>
      <StickyNav
        booking={listing.booking}
        reviews={listing.reviews}
        triggerRef={heroRef}
        onReserve={handleReserve}
      />
      <PhotoTour
        open={tourOpen}
        startPhoto={tourStart}
        onClose={closeTour}
        onOpenViewer={openViewer}
        title={listing.title}
        tour={listing.tour}
      />
      <PhotoViewer />
      <AmenitiesModal
        open={amenitiesOpen}
        onClose={closeAmenities}
        amenities={listing.amenitiesAll}
        unavailable={unavailableAmenities}
      />
    </>
  );
}
