"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import Portal from "./Portal";
import clsx from "clsx";

type SlideOverProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  /** Tailwind width like "max-w-md" (default) or "max-w-lg" etc. */
  maxWidthClassName?: string;
  children?: React.ReactNode;
};

export default function SlideOver({
  open,
  onClose,
  title = "Add track",
  maxWidthClassName = "max-w-md",
  children,
}: SlideOverProps) {
  // lock scroll
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // esc to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <Portal>
      {/* Scrim */}
      <div
        className={clsx(
          "fixed inset-0 z-[10000] bg-black/40 transition-opacity",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden
      />
      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        className={clsx(
          "fixed inset-y-0 right-0 z-[10001] w-[800px] bg-white shadow-xl border-l border-neutral-200",
          "transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full",
          maxWidthClassName // e.g. max-w-md (default)
        )}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-200 bg-white/90 px-3 py-2 backdrop-blur">
          <h2 className="truncate text-base font-semibold text-neutral-900">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body (scrollable) */}
        <div className="h-full overflow-y-auto p-3">
          {/* constrain inner width a bit more for comfort */}
          <div className="mx-auto w-full max-w-sm">{children}</div>
        </div>
      </aside>
    </Portal>
  );
}
