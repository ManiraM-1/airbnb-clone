"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Toast } from "@/components/layout/Toast";

// Toast (SPEC §10.3): one message at a time, visible ~2s. A new trigger replaces the text and
// restarts the timer.

const VISIBLE_MS = 2000;

type ShowToast = (message: string) => void;

const ToastContext = createContext<ShowToast | null>(null);

export interface ToastProviderProps {
  children: ReactNode;
}

/** Provides `useToast()` and renders the single page toast after its children. */
export function ToastProvider({ children }: ToastProviderProps) {
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const show = useCallback<ShowToast>((text) => {
    clearTimeout(timer.current);
    setMessage(text);
    setVisible(true);
    timer.current = setTimeout(() => setVisible(false), VISIBLE_MS);
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <Toast message={message} visible={visible} />
    </ToastContext.Provider>
  );
}

/** Returns `showToast(message)`. Must be used inside <ToastProvider>. */
export function useToast(): ShowToast {
  const show = useContext(ToastContext);
  if (!show) throw new Error("useToast must be used inside <ToastProvider>");
  return show;
}
