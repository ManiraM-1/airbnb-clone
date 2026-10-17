// Stack of open dialogs (SPEC §11). The top-most dialog is the only interactive part of the
// page: every other direct child of <body> is made `inert`, and the body scroll is locked
// while any dialog is open. Elements marked `data-dialog-exempt` (the toast's live region)
// are never made inert, so announcements still reach screen readers.

const stack: HTMLElement[] = [];
/** Elements this module made inert, so we only ever undo our own changes. */
const inerted = new Set<HTMLElement>();

function apply(): void {
  const top = stack.at(-1);
  for (const child of Array.from(document.body.children)) {
    if (!(child instanceof HTMLElement)) continue;
    const shouldBeInert =
      top !== undefined && !child.contains(top) && !child.hasAttribute("data-dialog-exempt");
    if (shouldBeInert && !child.inert) {
      child.inert = true;
      inerted.add(child);
    } else if (!shouldBeInert && inerted.has(child)) {
      child.inert = false;
      inerted.delete(child);
    }
  }
  document.body.style.overflow = top ? "hidden" : "";
}

export function pushDialog(root: HTMLElement): void {
  if (!stack.includes(root)) stack.push(root);
  apply();
}

export function popDialog(root: HTMLElement): void {
  const index = stack.indexOf(root);
  if (index !== -1) stack.splice(index, 1);
  apply();
}

export function isTopDialog(root: HTMLElement): boolean {
  return stack.at(-1) === root;
}

const TABBABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

/** Keyboard-reachable elements inside `container`, in DOM order, skipping hidden ones. */
export function getTabbable(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(TABBABLE)).filter(
    (el) => !el.closest("[inert]") && el.getClientRects().length > 0 && getComputedStyle(el).visibility !== "hidden",
  );
}
