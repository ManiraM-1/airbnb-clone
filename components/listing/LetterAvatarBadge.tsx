import type { LetterAvatar } from "@/lib/types";
import styles from "./LetterAvatarBadge.module.css";

export interface LetterAvatarBadgeProps {
  avatar: LetterAvatar;
  /** Circle diameter in px. */
  size: number;
  /** Sets the letter's font size and weight. */
  className?: string;
}

/** Coloured circle with an initial, for people without a photo (reviewers, co-hosts). */
export function LetterAvatarBadge({ avatar, size, className }: LetterAvatarBadgeProps) {
  return (
    <span
      className={`${styles.avatar} ${className ?? ""}`}
      style={{ width: size, height: size, background: avatar.bg, color: avatar.color }}
      aria-hidden="true"
    >
      {avatar.letter}
    </span>
  );
}
