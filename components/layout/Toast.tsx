// Toast: SPEC §10.3. Placeholder until built.
// data-dialog-exempt: stays outside the inert page while a dialog is open, so it is announced.
export function Toast() {
  return <div role="status" aria-live="polite" data-dialog-exempt="" />;
}
