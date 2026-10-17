"use client";

import type { MouseEvent } from "react";
import { getIcon } from "@/components/icons/registry";
import type { Listing } from "@/lib/types";
import styles from "./ThingsToKnow.module.css";

const LABELS = {
  heading: "Things to know",
  learnMore: "Learn more",
  learnMoreAbout: (title: string) => `Learn more about ${title}`,
} as const;

/** "Learn more" does nothing in the reference (SPEC §10.4). */
function preventNavigation(event: MouseEvent<HTMLAnchorElement>) {
  event.preventDefault();
}

export interface ThingsToKnowProps {
  items: Listing["thingsToKnow"];
}

// Things to know: SPEC §7.4.
export function ThingsToKnow({ items }: ThingsToKnowProps) {
  return (
    <section className={styles.thingsToKnow}>
      <h2 className={styles.heading}>{LABELS.heading}</h2>
      <div className={styles.grid}>
        {items.map((item) => {
          const ItemIcon = getIcon(item.icon);
          return (
            <div key={item.title}>
              {ItemIcon ? <ItemIcon size={24} strokeWidth={1.5} /> : null}
              <h3 className={styles.title}>{item.title}</h3>
              <ul className={styles.lines}>
                {item.lines.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <a
                href="#"
                className={styles.learnMore}
                aria-label={LABELS.learnMoreAbout(item.title)}
                onClick={preventNavigation}
              >
                {LABELS.learnMore}
              </a>
            </div>
          );
        })}
      </div>
    </section>
  );
}
