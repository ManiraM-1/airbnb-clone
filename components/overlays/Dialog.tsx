"use client";

import { useEffect, useEffectEvent, useRef, type ReactNode } from "react";
import { getTabbable, isTopDialog, popDialog, pushDialog } from "@/lib/dialogStack";
import styles from "./Dialog.module.css";

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  /** Accessible name (aria-label) of the dialog. */
  label: string;
  /** Fixed full-screen root: positioning, colours and open/closed transitions (via [data-open]). */
  className?: string;
  /** The role="dialog" element. */
  panelClassName?: string;
  /** When set, renders a backdrop behind the panel that closes the dialog on click. */
  backdropClassName?: string;
  children: ReactNode;
}

/**
 * Shared accessible dialog (SPEC §11). Stays mounted: while closed it is `visibility: hidden`
 * (after its closing transition), so it can't be focused or read.
 * On open: focus moves to the first control, Tab/Shift+Tab stay inside, the rest of the page
 * is inert and the body scroll is locked. Esc closes the top-most dialog only. On close,
 * focus returns to the element that opened it, without scrolling the page.
 */
export function Dialog({ open, onClose, label, className, panelClassName, backdropClassName, children }: DialogProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const requestClose = useEffectEvent(() => onClose());

  useEffect(() => {
    const root = rootRef.current;
    const panel = panelRef.current;
    if (!open || !root || !panel) return;

    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    pushDialog(root);
    (getTabbable(panel)[0] ?? panel).focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (!isTopDialog(root)) return;
      if (event.key === "Escape") {
        event.preventDefault();
        requestClose();
        return;
      }
      if (event.key !== "Tab") return;
      const tabbable = getTabbable(panel);
      if (tabbable.length === 0) {
        event.preventDefault();
        panel.focus({ preventScroll: true });
        return;
      }
      const first = tabbable[0];
      const last = tabbable[tabbable.length - 1];
      const active = document.activeElement;
      const outside = !(active instanceof Node) || !panel.contains(active);
      if (event.shiftKey && (outside || active === first || active === panel)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (outside || active === last)) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      popDialog(root);
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, [open]);

  return (
    <div ref={rootRef} className={`${styles.root} ${className ?? ""}`} data-open={open}>
      {backdropClassName ? <div className={backdropClassName} aria-hidden="true" onClick={onClose} /> : null}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        className={`${styles.panel} ${panelClassName ?? ""}`}
      >
        {children}
      </div>
    </div>
  );
}
