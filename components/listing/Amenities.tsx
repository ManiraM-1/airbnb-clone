import { getAmenityIcon } from "@/components/icons/amenityIcons";
import type { Listing } from "@/lib/types";
import styles from "./Amenities.module.css";

const HEADING = "What this place offers";
/** Read before a struck-through amenity, which is otherwise only shown visually. */
const UNAVAILABLE_LABEL = "Unavailable: ";
const showAllLabel = (total: number) => `Show all ${total} amenities`;

export interface AmenitiesProps {
  amenities: Listing["amenitiesPreview"];
  total: number;
  /** Opens the amenities modal (SPEC §10.1). */
  onShowAll: () => void;
}

// Amenities preview: SPEC §5.7.
export function Amenities({ amenities, total, onShowAll }: AmenitiesProps) {
  return (
    <section id="amenities" className={styles.amenities}>
      <h2 className={styles.heading}>{HEADING}</h2>
      <ul className={styles.grid}>
        {amenities.map((item) => {
          const ItemIcon = getAmenityIcon(item.icon);
          return (
            <li key={item.name} className={`${styles.item} ${item.available ? "" : styles.unavailable}`}>
              <span className={styles.icon}>{ItemIcon ? <ItemIcon size={24} struck={!item.available} /> : null}</span>
              <span className={styles.name}>
                {item.available ? null : <span className="visually-hidden">{UNAVAILABLE_LABEL}</span>}
                {item.name}
              </span>
            </li>
          );
        })}
      </ul>
      <button type="button" className={styles.showAll} aria-haspopup="dialog" onClick={onShowAll}>
        {showAllLabel(total)}
      </button>
    </section>
  );
}
