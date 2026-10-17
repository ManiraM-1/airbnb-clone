"use client";

import { CloseIcon } from "@/components/icons/CloseIcon";
import { getAmenityIcon } from "@/components/icons/amenityIcons";
import type { Listing } from "@/lib/types";
import { Dialog } from "./Dialog";
import styles from "./AmenitiesModal.module.css";

const TITLE = "What this place offers";
const CLOSE_LABEL = "Close";

export interface AmenitiesModalProps {
  open: boolean;
  onClose: () => void;
  amenities: Listing["amenitiesAll"];
  /** Names marked unavailable in the preview (struck through there and here). */
  unavailable: ReadonlySet<string>;
}

// Amenities modal: SPEC §10.1. URL does not change.
export function AmenitiesModal({ open, onClose, amenities, unavailable }: AmenitiesModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      label={TITLE}
      className={styles.root}
      backdropClassName={styles.backdrop}
      panelClassName={styles.panel}
    >
      <div className={styles.topBar}>
        <button type="button" className={styles.close} aria-label={CLOSE_LABEL} onClick={onClose}>
          <CloseIcon size={16} strokeWidth={1.5} />
        </button>
      </div>
      <div className={styles.body}>
        <h2 className={styles.title}>{TITLE}</h2>
        {amenities.map((group) => (
          <section key={group.category} className={styles.group}>
            <h3 className={styles.category}>{group.category}</h3>
            <ul>
              {group.items.map((name) => {
                const ItemIcon = getAmenityIcon(name);
                const isUnavailable = unavailable.has(name);
                return (
                  <li key={name} className={`${styles.item} ${isUnavailable ? styles.unavailable : ""}`}>
                    <span className={styles.icon}>{ItemIcon ? <ItemIcon size={24} struck={isUnavailable} /> : null}</span>
                    <span className={styles.name}>{name}</span>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </Dialog>
  );
}
