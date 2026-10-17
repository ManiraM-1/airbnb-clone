"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeftIcon } from "@/components/icons/ChevronLeftIcon";
import { ChevronRightIcon } from "@/components/icons/ChevronRightIcon";
import { StarIcon } from "@/components/icons/StarIcon";
import type { Listing } from "@/lib/types";
import styles from "./MoreStays.module.css";

const LABELS = {
  heading: "More stays nearby",
  previous: "Previous",
  next: "Next",
  page: (current: number, total: number) => `${current} / ${total}`,
  rating: (rating: string) => `Rated ${rating} out of 5`,
} as const;

interface Paging {
  page: number;
  pages: number;
  atStart: boolean;
  atEnd: boolean;
}

const INITIAL_PAGING: Paging = { page: 1, pages: 2, atStart: true, atEnd: false };

function readPaging(track: HTMLElement): Paging {
  const { scrollLeft, scrollWidth, clientWidth } = track;
  const max = scrollWidth - clientWidth;
  const pages = Math.max(1, Math.ceil(scrollWidth / clientWidth));
  const atStart = scrollLeft <= 1;
  const atEnd = scrollLeft >= max - 1;
  const page = atEnd ? pages : Math.floor(scrollLeft / clientWidth) + 1;
  return { page, pages, atStart, atEnd };
}

export interface MoreStaysProps {
  stays: Listing["moreStays"];
}

// More stays nearby: SPEC §7.5.
export function MoreStays({ stays }: MoreStaysProps) {
  const trackRef = useRef<HTMLUListElement>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const [paging, setPaging] = useState<Paging>(INITIAL_PAGING);

  const update = useCallback(() => {
    const track = trackRef.current;
    if (track) setPaging(readPaging(track));
  }, []);

  useEffect(() => {
    update();
  }, [update]);

  // A disabled button drops keyboard focus; hand it to the other arrow instead.
  useEffect(() => {
    if (paging.atEnd && document.activeElement === nextRef.current) prevRef.current?.focus();
    if (paging.atStart && document.activeElement === prevRef.current) nextRef.current?.focus();
  }, [paging.atStart, paging.atEnd]);

  const scrollByPage = (direction: 1 | -1) => {
    const track = trackRef.current;
    // Smooth via the track's `scroll-behavior` (instant under reduced motion).
    if (track) track.scrollBy({ left: direction * track.clientWidth });
  };

  return (
    <section className={styles.moreStays}>
      <div className={styles.header}>
        <h2 className={styles.heading}>{LABELS.heading}</h2>
        <div className={styles.controls}>
          <span className={styles.counter} aria-live="polite">
            {LABELS.page(paging.page, paging.pages)}
          </span>
          <button
            ref={prevRef}
            type="button"
            className={styles.arrow}
            aria-label={LABELS.previous}
            disabled={paging.atStart}
            onClick={() => scrollByPage(-1)}
          >
            <ChevronLeftIcon size={12} strokeWidth={3} />
          </button>
          <button
            ref={nextRef}
            type="button"
            className={styles.arrow}
            aria-label={LABELS.next}
            disabled={paging.atEnd}
            onClick={() => scrollByPage(1)}
          >
            <ChevronRightIcon size={12} strokeWidth={3} />
          </button>
        </div>
      </div>
      <ul ref={trackRef} className={styles.track} onScroll={update}>
        {stays.map((stay, i) => (
          <li key={`${stay.title}-${i}`} className={styles.card}>
            <Image src={stay.image} alt="" width={208} height={208} unoptimized className={styles.image} />
            <h3 className={styles.title}>{stay.title}</h3>
            <p className={styles.meta}>
              {stay.price}{" "}
              <span className={styles.rating} role="img" aria-label={LABELS.rating(stay.rating)}>
                <StarIcon size={10} />
                {stay.rating}
              </span>
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
