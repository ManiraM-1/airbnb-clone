"use client";

import { useEffect, useState, type RefObject } from "react";
import { StarIcon } from "@/components/icons/StarIcon";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import type { Listing } from "@/lib/types";
import styles from "./StickyNav.module.css";

const LINKS = [
  { id: "photos", label: "Photos" },
  { id: "amenities", label: "Amenities" },
  { id: "reviews", label: "Reviews" },
  { id: "location", label: "Location" },
] as const;
const SECTION_IDS = LINKS.map((link) => link.id);

const LABELS = {
  nav: "Listing sections",
  priceFor: (nights: number) => ` for ${nights} nights`,
  reviews: (count: number) => `${count} reviews`,
  reserve: "Reserve",
} as const;

/** Nav height: a section is "current" once its top passes under the nav. */
const NAV_HEIGHT = 67;

export interface StickyNavProps {
  booking: Listing["booking"];
  reviews: Listing["reviews"];
  /** The nav shows once this element's bottom edge has scrolled above the viewport. */
  triggerRef: RefObject<HTMLElement | null>;
  /** Reserve click: the page shows the "You won't be charged yet" toast (SPEC §10.3). */
  onReserve: () => void;
}

// Sticky section nav: SPEC §10.2.
export function StickyNav({ booking, reviews, triggerRef, onReserve }: StickyNavProps) {
  const [visible, setVisible] = useState(false);
  const active = useScrollSpy(SECTION_IDS, NAV_HEIGHT);

  useEffect(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(!entry.isIntersecting && entry.boundingClientRect.bottom <= 0);
    });
    observer.observe(trigger);
    return () => observer.disconnect();
  }, [triggerRef]);

  return (
    <div className={styles.bar} data-visible={visible}>
      <div className={styles.inner}>
        <nav aria-label={LABELS.nav} className={styles.links}>
          {LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className={`${styles.link} ${active === link.id ? styles.active : ""}`}
              aria-current={active === link.id ? "location" : undefined}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className={styles.right}>
          <div className={styles.summary}>
            <p className={styles.priceLine}>
              <span className={styles.price}>{booking.price}</span>
              <span className={styles.small}>{LABELS.priceFor(booking.nights)}</span>
            </p>
            <p className={`${styles.small} ${styles.rating}`}>
              <StarIcon size={11} className={styles.star} />
              {reviews.rating} · {LABELS.reviews(reviews.count)}
            </p>
          </div>
          <button type="button" className={styles.reserve} onClick={onReserve}>
            {LABELS.reserve}
          </button>
        </div>
      </div>
    </div>
  );
}
