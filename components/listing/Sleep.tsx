import Image from "next/image";
import type { Listing } from "@/lib/types";
import styles from "./Sleep.module.css";

const HEADING = "Where you'll sleep";

export interface SleepProps {
  sleep: Listing["sleep"];
}

// Where you'll sleep: SPEC §5.6.
export function Sleep({ sleep }: SleepProps) {
  return (
    <section className={styles.sleep}>
      <h2 className={styles.heading}>{HEADING}</h2>
      <ul className={styles.grid}>
        {sleep.map((area) => (
          <li key={area.title}>
            <Image
              src={area.image}
              alt=""
              width={318}
              height={212}
              unoptimized
              className={styles.image}
            />
            <h3 className={styles.title}>{area.title}</h3>
            <p className={styles.text}>{area.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
