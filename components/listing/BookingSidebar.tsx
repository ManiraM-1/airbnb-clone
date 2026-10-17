import Image from "next/image";
import type { MouseEvent } from "react";
import { ChevronDownIcon } from "@/components/icons/ChevronDownIcon";
import { FlagIcon } from "@/components/icons/FlagIcon";
import { formatUsDate } from "@/lib/dates";
import type { Listing } from "@/lib/types";
import styles from "./BookingSidebar.module.css";

const DISCOUNT_ICON = "/assets/images/ui/discount.svg";
const LABELS = {
  region: "Booking",
  claim: "Claim",
  priceFor: (nights: number) => `for ${nights} nights`,
  checkIn: "Check-in",
  checkOut: "Checkout",
  guests: "Guests",
  cancellation: "Free cancellation before ",
  reserve: "Reserve",
  notCharged: "You won't be charged yet",
  report: "Report this listing",
} as const;

/** SPEC §10.4: these links do nothing in the reference. */
function preventNavigation(event: MouseEvent<HTMLAnchorElement>) {
  event.preventDefault();
}

export interface BookingSidebarProps {
  booking: Listing["booking"];
  /** Reserve click: the page shows the "You won't be charged yet" toast (SPEC §10.3). */
  onReserve: () => void;
}

// Booking sidebar: SPEC §6. The inner wrapper sticks 100px below the viewport top.
export function BookingSidebar({ booking, onReserve }: BookingSidebarProps) {
  return (
    <aside className={styles.sidebar} aria-label={LABELS.region}>
      <div className={styles.sticky}>
        <div className={styles.discount}>
          <Image src={DISCOUNT_ICON} alt="" width={32} height={32} unoptimized className={styles.discountIcon} />
          <p className={styles.discountText}>
            {booking.discount.text}
            <br />
            <a href="#" className={styles.terms} onClick={preventNavigation}>
              {booking.discount.link}
            </a>
          </p>
          <button type="button" className={styles.claim}>
            {LABELS.claim}
          </button>
        </div>

        <div className={styles.card}>
          <p className={styles.priceRow}>
            <span className={styles.price}>{booking.price}</span>
            <span className={styles.priceFor}>{LABELS.priceFor(booking.nights)}</span>
          </p>

          <div className={styles.inputs}>
            <div className={styles.dates}>
              <div className={styles.field}>
                <span className={styles.label}>{LABELS.checkIn}</span>
                <span className={styles.value}>{formatUsDate(booking.checkIn)}</span>
              </div>
              <div className={`${styles.field} ${styles.checkout}`}>
                <span className={styles.label}>{LABELS.checkOut}</span>
                <span className={styles.value}>{formatUsDate(booking.checkOut)}</span>
              </div>
            </div>
            <div className={`${styles.field} ${styles.guests}`}>
              <div>
                <span className={styles.label}>{LABELS.guests}</span>
                <span className={styles.value}>{booking.guests}</span>
              </div>
              <ChevronDownIcon size={16} strokeWidth={2} />
            </div>
          </div>

          <p className={styles.cancellation}>
            {LABELS.cancellation}
            <b>{booking.cancellationBefore}</b>
          </p>

          <button type="button" className={styles.reserve} onClick={onReserve}>
            {LABELS.reserve}
          </button>
          <p className={styles.notCharged}>{LABELS.notCharged}</p>
        </div>

        <p className={styles.report}>
          <FlagIcon size={16} strokeWidth={1.5} />
          <a href="#" className={styles.reportLink} onClick={preventNavigation}>
            {LABELS.report}
          </a>
        </p>
      </div>
    </aside>
  );
}
