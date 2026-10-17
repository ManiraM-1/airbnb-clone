"use client";

import { useState } from "react";
import { HeartIcon } from "@/components/icons/HeartIcon";
import { ShareIcon } from "@/components/icons/ShareIcon";
import styles from "./TitleRow.module.css";

const LABELS = {
  share: "Share",
  save: "Save",
  saved: "Saved",
} as const;

export interface TitleRowProps {
  title: string;
  /** Share click: the page shows the "Share options" toast (SPEC §10.3). */
  onShare: () => void;
}

// Title row: SPEC §3.
export function TitleRow({ title, onShare }: TitleRowProps) {
  const [saved, setSaved] = useState(false);

  return (
    <section id="photos" className={styles.row}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.actions}>
        <button type="button" className={styles.action} onClick={onShare}>
          <ShareIcon size={16} strokeWidth={1.5} />
          <span className={styles.label}>{LABELS.share}</span>
        </button>
        <button
          type="button"
          className={`${styles.action} ${saved ? styles.saved : ""}`}
          aria-pressed={saved}
          onClick={() => setSaved((value) => !value)}
        >
          <HeartIcon size={16} strokeWidth={1.5} className={styles.heart} />
          <span className={styles.label}>{saved ? LABELS.saved : LABELS.save}</span>
        </button>
      </div>
    </section>
  );
}
