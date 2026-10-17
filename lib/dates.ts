// Date helpers for the booking data. ISO strings are treated as calendar dates (UTC), so the
// viewer's time zone never shifts a day.

const MONTHS_LONG = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const MONTHS_SHORT = MONTHS_LONG.map((m) => m.slice(0, 3));

export interface DayCell {
  /** YYYY-MM-DD */
  iso: string;
  day: number;
}

function parseIso(iso: string): { year: number; month: number; day: number } {
  const [year, month, day] = iso.split("-").map(Number);
  return { year, month, day: day ?? 1 };
}

const pad = (n: number) => String(n).padStart(2, "0");

/** "2026-10-18" → "10/18/2026" (booking card inputs). */
export function formatUsDate(iso: string): string {
  const { year, month, day } = parseIso(iso);
  return `${pad(month)}/${pad(day)}/${year}`;
}

/** "2026-10-18" → "18 Oct 2026" (calendar subtitle). */
export function formatShortDate(iso: string): string {
  const { year, month, day } = parseIso(iso);
  return `${day} ${MONTHS_SHORT[month - 1]} ${year}`;
}

/** "2026-10" → "October 2026". */
export function formatMonthTitle(yearMonth: string): string {
  const { year, month } = parseIso(yearMonth);
  return `${MONTHS_LONG[month - 1]} ${year}`;
}

/**
 * Weeks of a month for a Sunday-first grid: `null` pads the days before the 1st and after
 * the last day so every week has 7 cells.
 */
export function monthWeeks(yearMonth: string): (DayCell | null)[][] {
  const { year, month } = parseIso(yearMonth);
  const firstWeekday = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const cells: (DayCell | null)[] = Array.from({ length: firstWeekday }, () => null);
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ iso: `${year}-${pad(month)}-${pad(day)}`, day });
  }
  while (cells.length % 7) cells.push(null);
  const weeks: (DayCell | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}
