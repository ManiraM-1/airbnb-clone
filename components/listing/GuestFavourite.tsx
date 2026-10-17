import { Fragment } from "react";
import { LaurelIcon } from "@/components/icons/LaurelIcon";
import { StarIcon } from "@/components/icons/StarIcon";
import type { Listing } from "@/lib/types";
import styles from "./GuestFavourite.module.css";

const LABELS = {
  title: ["Guest", "favourite"],
  reviews: "Reviews",
  reviewCount: (count: number) => `${count} reviews`,
  stars: (rating: string) => `Rated ${rating} out of 5 stars.`,
} as const;

const STAR_COUNT = 5;

export interface GuestFavouriteProps {
  guestFavourite: Listing["guestFavourite"];
}

// Guest favourite card: SPEC §5.2.
export function GuestFavourite({ guestFavourite }: GuestFavouriteProps) {
  const rating = guestFavourite.rating.toFixed(2);

  return (
    <section className={styles.card}>
      <div className={styles.badge}>
        <LaurelIcon side="left" className={styles.laurel} />
        <p className={styles.title}>
          {LABELS.title.map((word, i) => (
            <Fragment key={word}>
              {i > 0 ? <br /> : null}
              {word}
            </Fragment>
          ))}
        </p>
        <LaurelIcon side="right" className={styles.laurel} />
      </div>
      <p className={styles.text}>{guestFavourite.text}</p>
      <div className={styles.stats}>
        <div className={styles.stat}>
          <p className={styles.value} aria-hidden="true">
            {rating}
          </p>
          <span className="visually-hidden">{LABELS.stars(rating)}</span>
          <span className={styles.stars} aria-hidden="true">
            {Array.from({ length: STAR_COUNT }, (_, i) => (
              <StarIcon key={i} size={12} className={styles.star} />
            ))}
          </span>
        </div>
        <span className={styles.divider} aria-hidden="true" />
        <div className={styles.stat}>
          <p className={`${styles.value} ${styles.count}`} aria-hidden="true">
            {guestFavourite.reviewCount}
          </p>
          <p className={styles.label} aria-hidden="true">
            {LABELS.reviews}
          </p>
          <span className="visually-hidden">{LABELS.reviewCount(guestFavourite.reviewCount)}</span>
        </div>
      </div>
    </section>
  );
}
