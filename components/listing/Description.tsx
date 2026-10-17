"use client";

import { useId, useState } from "react";
import { ChevronRightIcon } from "@/components/icons/ChevronRightIcon";
import styles from "./Description.module.css";

const LABELS = {
  heading: "About this place",
  translated: "Some info has been automatically translated.",
  showOriginal: "Show original",
  showMore: "Show more",
  showLess: "Show less",
} as const;

export interface DescriptionProps {
  description: string;
}

// Description: SPEC §5.5.
export function Description({ description }: DescriptionProps) {
  const [expanded, setExpanded] = useState(false);
  const textId = useId();
  const headingId = useId();

  return (
    <section className={styles.description} aria-labelledby={headingId}>
      {/* No visible heading in the reference; this one is for screen readers. */}
      <h2 id={headingId} className="visually-hidden">
        {LABELS.heading}
      </h2>
      <p className={styles.notice}>
        {LABELS.translated}{" "}
        {/* Link-styled, but an action rather than navigation; does nothing in the reference (SPEC §10.4). */}
        <button type="button" className={styles.original}>
          {LABELS.showOriginal}
        </button>
      </p>
      <p id={textId} className={`${styles.text} ${expanded ? "" : styles.collapsed}`}>
        {description}
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
