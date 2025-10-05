"use client";

import Link from "next/link";
import { Home } from "lucide-react";
// add more imports when you add more items

export default function MobileDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const items = [
    { href: "/", label: "Home", Icon: Home },
    // { href: "/library", label: "Library", Icon: Library },
  ] as const;

  return (
    <>
      {/* scrim */}
      <div
        aria-hidden
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* drawer */}
      <aside
        aria-label="Main menu"
        className={`fixed inset-y-0 left-0 z-50 w-80 max-w-[84vw] transform bg-white/90 backdrop-blur-xl border-r border-neutral-200 p-4 transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Browse
        </div>

        <nav className="space-y-1">
          {items.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-[15px] text-neutral-800 hover:bg-neutral-100"
            >
              <span className="grid h-8 w-8 place-items-center rounded-md border border-neutral-200 bg-white">
                <Icon className="h-4 w-4 opacity-80" />
              </span>
              <span className="truncate">{label}</span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
