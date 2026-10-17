import Image from "next/image";
import type { ComponentType } from "react";
import { BalloonIcon } from "@/components/icons/BalloonIcon";
import { CheckIcon } from "@/components/icons/CheckIcon";
import type { IconProps } from "@/components/icons/Icon";
import { SchoolIcon } from "@/components/icons/SchoolIcon";
import { ShieldIcon } from "@/components/icons/ShieldIcon";
import type { Listing } from "@/lib/types";
import { LetterAvatarBadge } from "./LetterAvatarBadge";
import styles from "./MeetHost.module.css";

const LABELS = {
  heading: "Meet your host",
  host: "Host",
  verified: "Verified host",
  reviews: "Reviews",
  rating: "Rating",
  yearsHosting: (years: number) => (years === 1 ? "Year hosting" : "Years hosting"),
  coHosts: "Co-Hosts",
  hostDetails: "Host details",
  responseRate: (rate: string) => `Response rate: ${rate}`,
  messageHost: "Message host",
  notice: "To help protect your payment, always use Airbnb to send money and communicate with hosts.",
} as const;

/** Icons for `host.facts`, in order: birth decade, school. */
const FACT_ICONS: ComponentType<IconProps>[] = [BalloonIcon, SchoolIcon];

export interface MeetHostProps {
  host: Listing["host"];
  cohosts: Listing["cohosts"];
}

// Meet your host: SPEC §7.3. "Message host" does nothing in the reference (SPEC §10.4).
export function MeetHost({ host, cohosts }: MeetHostProps) {
  const stats = [
    { value: host.reviews, label: LABELS.reviews },
    {
      value: (
        <>
          {host.rating}
          <span aria-hidden="true">★</span>
        </>
      ),
      label: LABELS.rating,
    },
    { value: String(host.yearsHosting), label: LABELS.yearsHosting(host.yearsHosting) },
  ];

  return (
    <section className={styles.meetHost}>
      <h2 className={styles.heading}>{LABELS.heading}</h2>
      <div className={styles.grid}>
        <div>
          <div className={styles.card}>
            <div className={styles.identity}>
              <div className={styles.avatarWrap}>
                <Image src={host.avatar} alt="" width={88} height={88} unoptimized className={styles.avatar} />
                <span className={styles.badge} role="img" aria-label={LABELS.verified}>
                  <CheckIcon size={14} strokeWidth={3} />
                </span>
              </div>
              <h3 className={styles.name}>{host.name}</h3>
              <p className={styles.role}>{LABELS.host}</p>
            </div>
            <dl className={styles.stats}>
              {stats.map((stat) => (
                <div key={stat.label} className={styles.stat}>
                  <dt className={styles.statLabel}>{stat.label}</dt>
                  <dd className={styles.statValue}>{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <ul className={styles.facts}>
            {host.facts.map((fact, i) => {
              const FactIcon = FACT_ICONS[i];
              return (
                <li key={fact} className={styles.fact}>
                  {FactIcon ? <FactIcon size={24} strokeWidth={1.5} /> : null}
                  {fact}
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <h3 className={styles.subheading}>{LABELS.coHosts}</h3>
          <ul className={styles.cohosts}>
            {cohosts.map((cohost) => (
              <li key={cohost.name} className={styles.cohost}>
                {typeof cohost.avatar === "string" ? (
                  <Image src={cohost.avatar} alt="" width={34} height={34} unoptimized className={styles.cohostAvatar} />
                ) : (
                  <LetterAvatarBadge avatar={cohost.avatar} size={34} className={styles.letterAvatar} />
                )}
                <span>{cohost.name}</span>
              </li>
            ))}
          </ul>
          <h3 className={`${styles.subheading} ${styles.details}`}>{LABELS.hostDetails}</h3>
          <p className={styles.response}>
            {LABELS.responseRate(host.responseRate)}
            <br />
            {host.responseTime}
          </p>
          <button type="button" className={styles.message}>
            {LABELS.messageHost}
          </button>
          <p className={styles.notice}>
            <ShieldIcon size={24} strokeWidth={1.5} className={styles.noticeIcon} />
            {LABELS.notice}
          </p>
        </div>
      </div>
    </section>
  );
}
