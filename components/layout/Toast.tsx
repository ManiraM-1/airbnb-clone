import styles from "./Toast.module.css";

export interface ToastProps {
  message: string;
  visible: boolean;
}

// Toast: SPEC §10.3. Rendered once by <ToastProvider> (hooks/useToast.tsx).
// data-dialog-exempt: stays outside the inert page while a dialog is open, so it is announced.
export function Toast({ message, visible }: ToastProps) {
  return (
    <div role="status" aria-live="polite" data-dialog-exempt="" className={styles.region}>
      <div className={styles.toast} data-visible={visible}>
        {message}
      </div>
    </div>
  );
}
