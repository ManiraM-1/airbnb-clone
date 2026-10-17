import { ChevronLeftIcon } from "@/components/icons/ChevronLeftIcon";
import { ChevronRightIcon } from "@/components/icons/ChevronRightIcon";
import { KeyboardIcon } from "@/components/icons/KeyboardIcon";
import { formatMonthTitle, formatShortDate, monthWeeks } from "@/lib/dates";
import type { Listing } from "@/lib/types";
import styles from "./Calendar.module.css";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const WEEKDAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const LABELS = {
  title: (nights: number, location: string) => `${nights} nights in ${location}`,
  previous: "Previous month",
  next: "Next month",
  clear: "Clear dates",
  keyboard: "Keyboard shortcuts",
} as const;

export interface CalendarProps {
  booking: Listing["booking"];
}

// Calendar: SPEC §5.8. Static: days, month arrows and "Clear dates" do nothing (reference).
export function Calendar({ booking }: CalendarProps) {
  const { checkIn, checkOut } = booking;
  const blocked = new Set(booking.blockedDates);

  const dayClass = (iso: string) => {
    if (iso === checkIn || iso === checkOut) return styles.endpoint;
    if (iso > checkIn && iso < checkOut) return styles.inRange;
    if (blocked.has(iso)) return styles.blocked;
    return "";
  };

  return (
    <section className={styles.calendar}>
      <h2 className={styles.title}>{LABELS.title(booking.nights, booking.location)}</h2>
      <p className={styles.range}>
        {formatShortDate(checkIn)} - {formatShortDate(checkOut)}
      </p>

      <div className={styles.months}>
        <div className={styles.nav}>
          <button type="button" className={styles.navButton} aria-label={LABELS.previous}>
            <ChevronLeftIcon size={16} strokeWidth={2.25} />
          </button>
          <button type="button" className={styles.navButton} aria-label={LABELS.next}>
            <ChevronRightIcon size={16} strokeWidth={2.25} />
          </button>
        </div>

        {booking.calendarMonths.map((month) => (
          <div key={month} className={styles.month}>
            <h3 className={styles.monthTitle}>{formatMonthTitle(month)}</h3>
            <table className={styles.grid}>
              <thead>
                <tr>
                  {WEEKDAYS.map((d, i) => (
                    <th key={i} scope="col" abbr={WEEKDAY_NAMES[i]} aria-label={WEEKDAY_NAMES[i]} className={styles.weekday}>
                      {d}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {monthWeeks(month).map((week, w) => (
                  <tr key={w}>
                    {week.map((cell, i) => (
                      <td key={i} className={styles.cell}>
                        {cell ? <span className={`${styles.day} ${dayClass(cell.iso)}`}>{cell.day}</span> : null}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <span className={styles.keyboard} role="img" aria-label={LABELS.keyboard}>
          <KeyboardIcon size={18} strokeWidth={1.5} />
        </span>
        <button type="button" className={styles.clear}>
          {LABELS.clear}
        </button>
      </div>
    </section>
  );
}
