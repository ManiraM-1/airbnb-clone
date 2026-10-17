import Image from "next/image";
import type { Listing } from "@/lib/types";
import styles from "./HostRow.module.css";

const LABELS = {
  hostedBy: (name: string) => `Hosted by ${name}`,
  yearsHosting: (years: number) => `${years} ${years === 1 ? "year" : "years"} hosting`,
} as const;

export interface HostRowProps {
  host: Listing["host"];
}

// Host row: SPEC §5.3.
export function HostRow({ host }: HostRowProps) {
  return (
    <section className={styles.row}>
      <Image src={host.avatar} alt="" width={46} height={46} unoptimized className={styles.avatar} />
      <div>
        <h2 className={styles.name}>{LABELS.hostedBy(host.name)}</h2>
        <p className={styles.meta}>{LABELS.yearsHosting(host.yearsHosting)}</p>
      </div>
    </section>
  );
}
