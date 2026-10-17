import type { Listing } from "@/lib/types";
import styles from "./Overview.module.css";

const DETAIL_SEPARATOR = " · ";

export interface OverviewProps {
  overview: Listing["overview"];
}

// Overview: SPEC §5.1.
export function Overview({ overview }: OverviewProps) {
  return (
    <section className={styles.overview}>
      <h2 className={styles.heading}>{overview.heading}</h2>
      <p className={styles.details}>{overview.details.join(DETAIL_SEPARATOR)}</p>
    </section>
  );
}
