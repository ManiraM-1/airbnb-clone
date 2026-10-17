"use client";

import { useEffect, useState } from "react";

/** Far enough above the viewport that no section's bottom can be beyond it. */
const ABOVE = 100_000;

/**
 * Scroll-spy (SPEC §10.2): returns the id of the last section whose top has scrolled above
 * `offset` px from the top of the viewport (the first id while none has).
 *
 * The IntersectionObserver's root runs from far above the page down to the line at `offset`, so
 * a section "intersects" exactly while its top is above that line, and every crossing fires,
 * even after an instant jump over several sections.
 */
export function useScrollSpy(ids: readonly string[], offset: number): string {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const above = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) above.add(entry.target.id);
          else above.delete(entry.target.id);
        }
        setActive(ids.findLast((id) => above.has(id)) ?? ids[0]);
      },
      { rootMargin: `${ABOVE}px 0px ${offset - window.innerHeight}px 0px` },
    );
    for (const id of ids) {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    }
    return () => observer.disconnect();
  }, [ids, offset]);

  return active;
}
