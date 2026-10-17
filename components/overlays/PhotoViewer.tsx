"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronLeftIcon } from "@/components/icons/ChevronLeftIcon";
import { ChevronRightIcon } from "@/components/icons/ChevronRightIcon";
import { CloseIcon } from "@/components/icons/CloseIcon";
import { GridIcon } from "@/components/icons/GridIcon";
import type { TourPhoto } from "@/lib/photos";
import { Dialog } from "./Dialog";
import styles from "./PhotoViewer.module.css";

const LABELS = {
  dialog: "Photo viewer",
  grid: "Show all photos",
  close: "Close",
  previous: "Previous",
  next: "Next",
} as const;

export interface PhotoViewerProps {
  /** Flattened index (0–42) of the photo shown; null while closed. */
  index: number | null;
  photos: TourPhoto[];
  onNavigate: (index: number) => void;
  /** Back to the Photo Tour (Esc, Close, grid button). */
  onClose: () => void;
}

// Photo viewer (lightbox): SPEC §9. Stacked above the Photo Tour.
export function PhotoViewer({ index, photos, onNavigate, onClose }: PhotoViewerProps) {
  const open = index !== null;
  const previousRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  // Keep the last photo while fading out; nothing is loaded until the viewer first opens.
  const [shown, setShown] = useState<number | null>(index);
  if (index !== null && index !== shown) setShown(index);

  const photo = shown === null ? null : photos[shown];
  const atFirst = shown === 0;
  const atLast = shown === photos.length - 1;

  const goTo = (target: number) => {
    if (target >= 0 && target < photos.length) onNavigate(target);
  };

  // A focused arrow that becomes disabled would drop focus to <body>: hand it to the other arrow.
  const onArrowClick = (step: -1 | 1) => {
    if (shown === null) return;
    const target = shown + step;
    if (step === -1 && target === 0) nextRef.current?.focus();
    if (step === 1 && target === photos.length - 1) previousRef.current?.focus();
    goTo(target);
  };

  // ArrowLeft / ArrowRight navigate, stopping at the ends.
  useEffect(() => {
    if (index === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      const target = index + (event.key === "ArrowLeft" ? -1 : 1);
      if (target >= 0 && target < photos.length) onNavigate(target);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [index, photos.length, onNavigate]);

  // Preload the neighbours so the arrows swap instantly.
  useEffect(() => {
    if (index === null) return;
    for (const neighbour of [photos[index - 1], photos[index + 1]]) {
      if (neighbour) new window.Image().src = neighbour.src;
    }
  }, [index, photos]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      label={LABELS.dialog}
      className={styles.root}
      panelClassName={styles.panel}
      getReturnFocus={() =>
        index === null ? null : document.querySelector<HTMLElement>(`[data-photo-index="${index}"]`)
      }
    >
      <header className={styles.header}>
        <button type="button" className={`${styles.iconButton} ${styles.grid}`} aria-label={LABELS.grid} onClick={onClose}>
          <GridIcon size={19} />
        </button>
        <h2 className={styles.room}>{photo?.room}</h2>
        <div className={styles.actions}>
          <p className={styles.counter} aria-live="polite">
            {shown === null ? "" : `${shown + 1} of ${photos.length}`}
          </p>
          <button type="button" className={styles.iconButton} aria-label={LABELS.close} onClick={onClose}>
            <CloseIcon size={16} strokeWidth={1.2} className={styles.closeGlyph} />
          </button>
        </div>
      </header>

      <div className={styles.stage}>
        <div className={styles.frame}>
          {photo ? (
            <Image
              src={photo.src}
              alt={photo.room}
              fill
              sizes="1248px"
              unoptimized
              loading="eager"
              className={styles.image}
            />
          ) : null}
        </div>
      </div>

      <button
        ref={previousRef}
        type="button"
        className={`${styles.arrow} ${styles.previous}`}
        aria-label={LABELS.previous}
        disabled={atFirst}
        onClick={() => onArrowClick(-1)}
      >
        <ChevronLeftIcon size={20} strokeWidth={2.4} className={styles.previousGlyph} />
      </button>
      <button
        ref={nextRef}
        type="button"
        className={`${styles.arrow} ${styles.next}`}
        aria-label={LABELS.next}
        disabled={atLast}
        onClick={() => onArrowClick(1)}
      >
        <ChevronRightIcon size={20} strokeWidth={2.6} className={styles.nextGlyph} />
      </button>
    </Dialog>
  );
}
