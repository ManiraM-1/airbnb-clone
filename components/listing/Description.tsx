"use client";

import { useId, useState, type MouseEvent } from "react";
import { ChevronRightIcon } from "@/components/icons/ChevronRightIcon";
import styles from "./Description.module.css";

const LABELS = {
  translated: "Some info has been automatically translated.",
  showOriginal: "Show original",
  showMore: "Show more",
  showLess: "Show less",
} as const;

export interface DescriptionProps {
  description: string;
}

/** "Show original" does nothing in the reference (SPEC §10.4). */
function preventNavigation(event: MouseEvent<HTMLAnchorElement>) {
  event.preventDefault();
}

// Description: SPEC §5.5.
export function Description({ description }: DescriptionProps) {
  const [expanded, setExpanded] = useState(false);
  const textId = useId();

  return (
    <section className={styles.description}>
      <p className={styles.notice}>
        {LABELS.translated}{" "}
        <a href="#" className={styles.original} onClick={preventNavigation}>
          {LABELS.showOriginal}
        </a>
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
