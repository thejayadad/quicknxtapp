"use client";

import Link from "next/link";
import { useState, useEffect, useCallback, useMemo } from "react";
import { ArrowLeft, ArrowRight, Menu, X, Home, User2 } from "lucide-react";
import MobileDrawer from "./mobile-drawer";
import MobileNowPlayingBar from "./mobile-now-playing-bar";
import { HeaderNavItem } from "./header-types";

export type TopHeaderProps = {
  isAuthenticated?: boolean;
  displayName?: string | null;
  onSignIn?: () => void | Promise<void>;
  onSignOut?: () => void | Promise<void>;
  onBack?: () => void;
  onForward?: () => void;
  nowPlaying?: {
    title: string;
    artist: string;
    artworkUrl?: string;
    isPlaying?: boolean;
    progressMs?: number;
    durationMs?: number;
  };
  onTogglePlay?: () => void;
  onScrub?: (ms: number) => void;
};

const NAV_ITEMS: HeaderNavItem[] = [
  { href: "/", label: "Home", icon: Home },
  // Add more when ready, e.g. { href: "/library", label: "Library", icon: Library }
];

export default function TopHeader({
  isAuthenticated = false,
  displayName,
  onSignIn,
  onSignOut,
  onBack,
  onForward,
  nowPlaying,
  onTogglePlay,
  onScrub,
}: TopHeaderProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggle = useCallback(() => setDrawerOpen((v) => !v), []);
  const close = useCallback(() => setDrawerOpen(false), []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const userLabel = useMemo(
    () => displayName || (isAuthenticated ? "Account" : "Sign in"),
    [displayName, isAuthenticated]
  );

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-30 h-24 bg-gradient-to-b from-neutral-50/80 to-transparent" />

      <header className="sticky top-0 z-40 border-b border-neutral-200/70 bg-white/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/55">
        <div className="mx-auto max-w-screen-2xl px-3 sm:px-4">
          <div className="flex h-14 items-center justify-between">
            {/* Left: burger + back/forward + brand */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={toggle}
                aria-label={drawerOpen ? "Close menu" : "Open menu"}
                className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200/70 bg-white/70 hover:bg-white transition"
              >
                {drawerOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>

              <div className="hidden md:flex items-center gap-1.5">
                <IconButton label="Back" onClick={onBack}>
                  <ArrowLeft className="h-5 w-5" />
                </IconButton>
                <IconButton label="Forward" onClick={onForward}>
                  <ArrowRight className="h-5 w-5" />
                </IconButton>
              </div>

              <Link href="/" className="ml-2 text-sm font-semibold tracking-tight text-neutral-900">
                thejayadad • Music
              </Link>
            </div>

            {/* Right: auth */}
            <div className="flex items-center gap-2">
              <button
                onClick={isAuthenticated ? onSignOut : onSignIn}
                className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 text-sm text-neutral-800 transition hover:bg-white"
                aria-label={userLabel}
              >
                <User2 className="h-4 w-4 opacity-80" />
                <span className="hidden sm:inline">{userLabel}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileDrawer open={drawerOpen} onClose={close} items={NAV_ITEMS} />

      <MobileNowPlayingBar
        className="md:hidden"
        nowPlaying={nowPlaying}
        onTogglePlay={onTogglePlay}
        onScrub={onScrub}
      />
    </>
  );
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200/70 bg-white/70 hover:bg-white transition"
    >
      {children}
    </button>
  );
}
