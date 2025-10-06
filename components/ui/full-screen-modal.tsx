"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import clsx from "clsx";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  /** "fullscreen" (default) or "panel" (centered dialog) */
  variant?: "fullscreen" | "panel";
  /** Extra classes for the inner content wrapper */
  contentClassName?: string;
  children?: React.ReactNode;
};

export default function FullScreenModal({
  open,
  onClose,
  title = "Modal",
  variant = "fullscreen",
  contentClassName,
  children,
}: Props) {
  // lock scroll when open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // close on ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  // Common overlay
  return (
    <div className="fixed inset-0 z-[9999]">
      {/* Scrim */}
      <div
        aria-hidden
        onClick={variant === "panel" ? onClose : undefined}
        className="absolute inset-0 bg-black/40"
      />

      {variant === "panel" ? (
        // Centered dialog panel (non-fullscreen option)
        <div className="absolute inset-0 grid place-items-center p-4">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl">
            <Header title={title} onClose={onClose} />
            <div className={clsx("max-h-[80vh] overflow-y-auto p-4", contentClassName)}>
              {children}
            </div>
          </div>
        </div>
      ) : (
        // Fullscreen
        <div className="absolute inset-0 flex flex-col bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
          <Header title={title} onClose={onClose} sticky />
          {/* Scrollable body; wide on desktop, full-bleed on mobile */}
          <div className="flex-1 overflow-y-auto">
            <div className={clsx(
              "mx-auto w-full px-4 py-4 sm:px-6",
              // max width for content so fields don’t stretch too wide on desktop
              "max-w-3xl lg:max-w-4xl",
              contentClassName
            )}>
              {children}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Header({ title, onClose, sticky = false }: { title: string; onClose: () => void; sticky?: boolean }) {
  return (
    <div
      className={clsx(
        "flex items-center justify-between border-b border-neutral-200 bg-white/90 px-4 py-3 backdrop-blur",
        sticky && "sticky top-0 z-10"
      )}
    >
      <h2 className="truncate text-base font-semibold text-neutral-900">{title}</h2>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}
