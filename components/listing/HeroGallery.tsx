"use client";

import Image from "next/image";
import { useMemo, type Ref } from "react";
import { GridIcon } from "@/components/icons/GridIcon";
import { flattenTour, heroTourIndexes } from "@/lib/photos";
import type { Listing } from "@/lib/types";
import styles from "./HeroGallery.module.css";

const SECTION_LABEL = "Photos of this place";
const SHOW_ALL_LABEL = "Show all photos";

/** Grid placement per hero position (image 1 spans both rows on the left). */
const CELL_CLASSES = [styles.cell1, styles.cell2, styles.cell3, styles.cell4, styles.cell5];
/** Rendered widths for `sizes`: 560px on the left, 272px for the four on the right. */
const CELL_SIZES = ["560px", "272px", "272px", "272px", "272px"];

export interface HeroGalleryProps {
  title: string;
  hero: Listing["hero"];
  tour: Listing["tour"];
  /** Opens the Photo Tour; with an index, at that photo's room (SPEC §4, §8.4). */
  onOpenTour: (photoIndex?: number) => void;
  /** The section: the sticky nav shows once its bottom edge scrolls away (SPEC §10.2). */
  ref?: Ref<HTMLElement>;
}

// Hero gallery: SPEC §4.
export function HeroGallery({ title, hero, tour, onOpenTour, ref }: HeroGalleryProps) {
  const tourIndexes = useMemo(() => heroTourIndexes(hero, flattenTour(tour)), [hero, tour]);

  return (
    <section ref={ref} aria-label={SECTION_LABEL} className={styles.gallery}>
      <div className={styles.grid}>
        {hero.map((src, i) => (
          <button
            key={src}
            type="button"
            className={`${styles.cell} ${CELL_CLASSES[i]}`}
            aria-label={`${title} image ${i + 1}`}
            onClick={() => onOpenTour(tourIndexes[i])}
          >
            <Image
              src={src}
              alt=""
              fill
              sizes={CELL_SIZES[i]}
              unoptimized
              preload={i === 0}
              loading={i === 0 ? undefined : "eager"}
              className={styles.image}
            />
          </button>
        ))}
      </div>
      <button type="button" className={styles.showAll} onClick={() => onOpenTour()}>
        <GridIcon size={15} />
        <span>{SHOW_ALL_LABEL}</span>
      </button>
    </section>
  );
}
