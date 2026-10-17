"use client";

import Image from "next/image";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { ChevronLeftIcon } from "@/components/icons/ChevronLeftIcon";
import { HeartIcon } from "@/components/icons/HeartIcon";
import { ShareIcon } from "@/components/icons/ShareIcon";
import { flattenTour, tourLayout } from "@/lib/photos";
import type { Listing } from "@/lib/types";
import { Dialog } from "./Dialog";
import styles from "./PhotoTour.module.css";

const LABELS = {
  dialog: "Photo tour",
  back: "Back",
  share: "Share",
  save: "Save",
  categories: "Photo categories",
} as const;

/** Gap between the header and a room section scrolled to the top (SPEC §8.3). */
const ROOM_TOP_GAP = 24;

const roomId = (roomIndex: number) => `tour-room-${roomIndex}`;

/** Scrolls the tour so the room's section top sits 24px below the header. */
function scrollToRoom(scroller: HTMLElement, roomIndex: number, behavior: ScrollBehavior) {
  const section = document.getElementById(roomId(roomIndex));
  if (!section) return;
  const top =
    section.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop - ROOM_TOP_GAP;
  // Whole pixels, rounded up: the section lands at or just above 24px (measured ≈23.5px).
  scroller.scrollTo({ top: Math.ceil(top), behavior });
}

export interface PhotoTourProps {
  open: boolean;
  /** Flattened index of the photo the tour was opened from (positions its room at the top);
   *  null opens at the top (SPEC §8.4). */
  startPhoto: number | null;
  onClose: () => void;
  /** Opens the Photo Viewer at a flattened photo index (SPEC §9). */
  onOpenViewer: (index: number) => void;
  title: string;
  tour: Listing["tour"];
}

// Photo tour: SPEC §8.
export function PhotoTour({ open, startPhoto, onClose, onOpenViewer, title, tour }: PhotoTourProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [saved, setSaved] = useState(false);
  const rooms = useMemo(() => tourLayout(tour), [tour]);
  const photos = useMemo(() => flattenTour(tour), [tour]);

  // On open: instantly at the top, or at the room of the photo it was opened from.
  useLayoutEffect(() => {
    if (!open) return;
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const roomIndex = startPhoto === null ? undefined : photos[startPhoto]?.roomIndex;
    if (roomIndex === undefined) scroller.scrollTo({ top: 0, behavior: "instant" });
    else scrollToRoom(scroller, roomIndex, "instant");
  }, [open, startPhoto, photos]);

  const onCategoryClick = (roomIndex: number) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    scrollToRoom(scroller, roomIndex, reduce ? "instant" : "smooth");
  };

  return (
    <Dialog open={open} onClose={onClose} label={LABELS.dialog} className={styles.root} panelClassName={styles.panel}>
      <header className={styles.header}>
        <button type="button" className={`${styles.iconButton} ${styles.back}`} aria-label={LABELS.back} onClick={onClose}>
          <ChevronLeftIcon size={20} strokeWidth={1.3} />
        </button>
        <h2 className={styles.title}>{LABELS.dialog}</h2>
        <div className={styles.actions}>
          {/* No-op in the reference: only the title row's Share shows a toast (SPEC §10.3). */}
          <button type="button" className={styles.iconButton} aria-label={LABELS.share}>
            <ShareIcon size={18} />
          </button>
          <button
            type="button"
            className={`${styles.iconButton} ${saved ? styles.saved : ""}`}
            aria-label={LABELS.save}
            aria-pressed={saved}
            onClick={() => setSaved((value) => !value)}
          >
            <HeartIcon size={18} className={styles.heart} />
          </button>
        </div>
      </header>

      <div ref={scrollerRef} className={styles.scroller}>
        <div className={styles.content}>
          <nav aria-label={LABELS.categories} className={styles.categories}>
            {rooms.map((room) => (
              <button
                key={room.room}
                type="button"
                className={styles.category}
                aria-label={room.room}
                onClick={() => onCategoryClick(room.roomIndex)}
              >
                <span className={styles.thumb}>
                  <Image
                    src={room.rows[0][0].src}
                    alt=""
                    fill
                    sizes="112px"
                    unoptimized
                    className={styles.thumbImage}
                  />
                </span>
                <span className={styles.categoryLabel}>{room.room}</span>
              </button>
            ))}
          </nav>

          {rooms.map((room) => (
            <section
              key={room.room}
              id={roomId(room.roomIndex)}
              aria-labelledby={`${roomId(room.roomIndex)}-title`}
              className={styles.room}
            >
              <div className={styles.roomInfo}>
                <h3 id={`${roomId(room.roomIndex)}-title`} className={styles.roomTitle}>
                  {room.room}
                </h3>
                {room.features.length > 0 ? <p className={styles.features}>{room.features.join(" · ")}</p> : null}
              </div>
              <div className={styles.rows}>
                {room.rows.map((row) => (
                  <div key={row[0].index} className={styles.row}>
                    {row.map((photo) => (
                      <button
                        key={photo.index}
                        type="button"
                        className={`${styles.photo} ${row.length === 1 ? styles.photoFull : styles.photoHalf}`}
                        aria-label={`${title} image ${photo.index + 1}`}
                        data-photo-index={photo.index}
                        onClick={() => onOpenViewer(photo.index)}
                      >
                        <Image
                          src={photo.src}
                          alt={photo.room}
                          fill
                          sizes={row.length === 1 ? "458px" : "223px"}
                          unoptimized
                          className={styles.photoImage}
                        />
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </Dialog>
  );
}
