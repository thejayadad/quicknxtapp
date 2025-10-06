// components/header/mobile-drawer.tsx
"use client";

import Link from "next/link";
import { Home, Search } from "lucide-react";
import type { TrackCardData } from "@/components/tracks/track-card";
import Logo from "@/components/ui/logo";
import MyTracksSection from "../sidebar/my-tracks-section";

export type DrawerNavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

export default function MobileDrawer({
  open,
  onClose,
  isAuthenticated,
  myTracks,
  items = [
    { href: "/", label: "Home", icon: Home },
    { href: "/search", label: "Search", icon: Search },
  ],
}: {
  open: boolean;
  onClose: () => void;
  isAuthenticated?: boolean;
  myTracks?: TrackCardData[];
  items?: DrawerNavItem[];
}) {
  const tracks = myTracks ?? [];

  return (
    <>
      {/* Scrim */}
      <div
        aria-hidden
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Drawer */}
      <aside
        aria-label="Main menu"
        className={`fixed inset-y-0 left-0 z-50 w-80 max-w-[86vw] transform border-r border-neutral-200 bg-white backdrop-blur-xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-14 items-center border-b border-neutral-200/70 px-3">
          <Logo />
        </div>

        <div className="h-[calc(100%-3.5rem)] overflow-y-auto p-3">
          {/* Primary nav */}
          <nav className="space-y-1 pb-3">
            {items.map(({ href, label, icon: Icon }) => (
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

          {/* My Tracks collapsible */}
          <MyTracksSection isAuthenticated={!!isAuthenticated} tracks={tracks} />
        </div>
      </aside>
    </>
  );
}
