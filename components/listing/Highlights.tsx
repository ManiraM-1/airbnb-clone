import { useId } from "react";
import { getIcon } from "@/components/icons/registry";
import type { Listing } from "@/lib/types";
import styles from "./Highlights.module.css";

const HEADING = "Highlights";

export interface HighlightsProps {
  highlights: Listing["highlights"];
}

// Highlights: SPEC §5.4.
export function Highlights({ highlights }: HighlightsProps) {
  const headingId = useId();
  return (
    <section className={styles.highlights} aria-labelledby={headingId}>
      {/* No visible heading in the reference; this one is for screen readers. */}
      <h2 id={headingId} className="visually-hidden">
        {HEADING}
      </h2>
      <ul className={styles.list}>
        {highlights.map((item) => {
          const ItemIcon = getIcon(item.icon);
          return (
            <li key={item.title} className={styles.item}>
              <span className={styles.icon}>{ItemIcon ? <ItemIcon size={24} strokeWidth={1.5} /> : null}</span>
              <div>
                <h3 className={styles.title}>{item.title}</h3>
                <p className={styles.text}>{item.text}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
