"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { getIcon } from "@/components/icons/registry";
import { StarIcon } from "@/components/icons/StarIcon";
import type { Listing, Review, StarLevel } from "@/lib/types";
import { LetterAvatarBadge } from "./LetterAvatarBadge";
import styles from "./Reviews.module.css";

const LABELS = {
  guestFavourite: "Guest favourite",
  intro: "This home is a guest favourite based on ratings, reviews and reliability",
  howReviewsWork: "How reviews work",
  overall: "Overall rating",
  topics: "Review topics",
  showMore: "Show more",
  showLess: "Show less",
  showAll: (count: number) => `Show all ${count} reviews`,
  stars: (n: number) => `Rated ${n} out of 5 stars`,
  barShare: (share: number) => ` stars, ${Math.round(share * 100)}%`,
} as const;

const STAR_LEVELS: StarLevel[] = ["5", "4", "3", "2", "1"];

/** Measured (ref-full): "Show more" shows on the 233- and 700-char reviews, not on those of
 *  ≤137 chars; the 233-char one fits in 4 lines, so the reference does not decide by overflow. */
const SHOW_MORE_MIN_CHARS = 180;

export interface ReviewsProps {
  reviews: Listing["reviews"];
}

// Reviews: SPEC §7.1.
export function Reviews({ reviews }: ReviewsProps) {
  return (
    <section id="reviews" className={styles.reviews}>
      <div className={styles.header}>
        <div className={styles.score}>
          <Image src="/assets/images/ui/laurel-left.png" alt="" width={72} height={110} unoptimized />
          <p className={styles.rating}>{reviews.rating}</p>
          <Image src="/assets/images/ui/laurel-right.png" alt="" width={72} height={110} unoptimized />
        </div>
        <h2 className={styles.title}>{LABELS.guestFavourite}</h2>
        <p className={styles.intro}>{LABELS.intro}</p>
        <button type="button" className={styles.howLink}>
          {LABELS.howReviewsWork}
        </button>
      </div>

      <div className={styles.categories}>
        <div className={styles.overall}>
          <p className={styles.categoryLabel}>{LABELS.overall}</p>
          <ol className={styles.bars}>
            {STAR_LEVELS.map((level) => (
              <li key={level} className={styles.bar}>
                <span className={styles.barLabel}>{level}</span>
                <span className="visually-hidden">{LABELS.barShare(reviews.distribution[level])}</span>
                <span className={styles.track}>
                  <span className={styles.fill} style={{ width: `${reviews.distribution[level] * 100}%` }} />
                </span>
              </li>
            ))}
          </ol>
        </div>
        {reviews.categories.map((category) => {
          const CategoryIcon = getIcon(category.icon);
          return (
            <div key={category.name} className={styles.category}>
              <p className={styles.categoryLabel}>{category.name}</p>
              <p className={styles.categoryScore}>{category.score}</p>
              {CategoryIcon ? <CategoryIcon size={32} strokeWidth={1.5} className={styles.categoryIcon} /> : null}
            </div>
          );
        })}
      </div>

      <ul className={styles.topics} aria-label={LABELS.topics}>
        {reviews.topics.map((topic) => (
          <li key={topic.name}>
            <button type="button" className={styles.chip}>
              <Image src={topic.icon} alt="" width={20} height={20} unoptimized />
              <span className={styles.chipName}>{topic.name}</span>
              <span className={styles.chipCount}>{topic.count}</span>
            </button>
          </li>
        ))}
      </ul>

      <ul className={styles.cards}>
        {reviews.items.map((review) => (
          <li key={review.name}>
            <ReviewCard review={review} />
          </li>
        ))}
      </ul>

      <button type="button" className={styles.showAll}>
        {LABELS.showAll(reviews.count)}
      </button>
    </section>
  );
}

interface ReviewCardProps {
  review: Review;
}

function ReviewCard({ review }: ReviewCardProps) {
  const [expanded, setExpanded] = useState(false);
  const textId = useId();
  const canExpand = review.text.length > SHOW_MORE_MIN_CHARS;

  return (
    <article className={styles.card}>
      <div className={styles.author}>
        {typeof review.avatar === "string" ? (
          <Image src={review.avatar} alt="" width={42} height={42} unoptimized className={styles.avatar} />
        ) : (
          <LetterAvatarBadge avatar={review.avatar} size={42} className={styles.letterAvatar} />
        )}
        <div>
          <h3 className={styles.name}>{review.name}</h3>
          <p className={styles.tenure}>{review.tenure}</p>
        </div>
      </div>
      <p className={styles.meta}>
        <span className={styles.stars} role="img" aria-label={LABELS.stars(5)}>
          {[0, 1, 2, 3, 4].map((i) => (
            <StarIcon key={i} size={10} />
          ))}
        </span>
        <span aria-hidden="true">·</span>
        <span>{review.date}</span>
      </p>
      <p id={textId} className={`${styles.text} ${expanded ? "" : styles.clamped}`}>
        {review.text}
      </p>
      {canExpand ? (
        <button
          type="button"
          className={styles.toggle}
          aria-expanded={expanded}
          aria-controls={textId}
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? LABELS.showLess : LABELS.showMore}
        </button>
      ) : null}
    </article>
  );
}
