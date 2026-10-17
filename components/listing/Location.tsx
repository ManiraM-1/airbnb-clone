"use client";

import { useId, useState } from "react";
import { ChevronRightIcon } from "@/components/icons/ChevronRightIcon";
import { HomePinIcon } from "@/components/icons/HomePinIcon";
import { MinusIcon } from "@/components/icons/MinusIcon";
import { PlusIcon } from "@/components/icons/PlusIcon";
import { SearchIcon } from "@/components/icons/SearchIcon";
import type { Listing } from "@/lib/types";
import styles from "./Location.module.css";

const LABELS = {
  heading: "Where you’ll be",
  map: "Map",
  search: "Search",
  zoomIn: "Zoom in",
  zoomOut: "Zoom out",
  neighbourhood: "Neighbourhood highlights",
  showMore: "Show more",
  showLess: "Show less",
} as const;

export interface LocationProps {
  location: Listing["location"];
}

// Location: SPEC §7.2. The map is CSS only; its buttons do nothing in the reference (SPEC §10.4).
export function Location({ location }: LocationProps) {
  const [expanded, setExpanded] = useState(false);
  const textId = useId();

  return (
    <section id="location" className={styles.location}>
      <h2 className={styles.heading}>{LABELS.heading}</h2>
      <p className={styles.place}>{location.name}</p>
      <div className={styles.map} role="region" aria-label={LABELS.map}>
        <div className={styles.terrain} />
        <button type="button" className={styles.search} aria-label={LABELS.search}>
          <SearchIcon size={14} />
        </button>
        <div className={styles.zoom}>
          <button type="button" className={styles.zoomButton} aria-label={LABELS.zoomIn}>
            <PlusIcon size={14} />
          </button>
          <button type="button" className={styles.zoomButton} aria-label={LABELS.zoomOut}>
            <MinusIcon size={14} />
          </button>
        </div>
        <span className={styles.pin}>
          <HomePinIcon size={56} />
        </span>
      </div>
      <p className={styles.note}>{location.note}</p>
      <h3 className={styles.subheading}>{LABELS.neighbourhood}</h3>
      <p id={textId} className={`${styles.text} ${expanded ? "" : styles.collapsed}`}>
        {location.highlights}
      </p>
      <button
        type="button"
        className={styles.toggle}
        aria-expanded={expanded}
        aria-controls={textId}
        onClick={() => setExpanded((value) => !value)}
      >
        <span className={styles.toggleLabel}>{expanded ? LABELS.showLess : LABELS.showMore}</span>
        <ChevronRightIcon size={18} strokeWidth={2.67} className={styles.chevron} />
      </button>
    </section>
  );
}
