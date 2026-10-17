"use client";

import { useSyncExternalStore } from "react";

// Overlay state mirrored to the URL (SPEC §8.1, §9). The query string is the source of truth:
// writing it re-renders every subscriber, and the server snapshot is "no overlay open", so a page
// loaded with ?modal=… hydrates closed and opens right after.

export const MODAL_PHOTO_TOUR = "PHOTO_TOUR_SCROLLABLE";

/** Fired after we rewrite the query, since replaceState itself emits no event. */
const CHANGE_EVENT = "modalurlchange";

export interface ModalUrlState {
  modal: string | null;
  modalItem: number | null;
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener("popstate", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

const getSnapshot = () => window.location.search;
const getServerSnapshot = () => "";

/** Current `modal` / `modalItem` query params. */
export function useModalUrl(): ModalUrlState {
  const search = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const params = new URLSearchParams(search);
  const item = params.get("modalItem");
  return {
    modal: params.get("modal"),
    modalItem: item === null || Number.isNaN(Number(item)) ? null : Number(item),
  };
}

/** Sets (string/number) or removes (null) the given params, keeping the rest of the URL. */
export function writeModalUrl(updates: Partial<Record<keyof ModalUrlState, string | number | null>>): void {
  const url = new URL(window.location.href);
  for (const [key, value] of Object.entries(updates)) {
    if (value === null || value === undefined) url.searchParams.delete(key);
    else url.searchParams.set(key, String(value));
  }
  if (url.href === window.location.href) return;
  window.history.replaceState(null, "", url);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}
