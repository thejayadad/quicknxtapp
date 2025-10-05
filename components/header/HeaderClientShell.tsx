"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Menu, X } from "lucide-react";
import AuthButton from "./auth-button";
import MobileDrawer from "./mobile-drawer";

type Props = {
  isAuthenticated?: boolean;
  displayName?: string | null;
};

export default function HeaderClientShell({ isAuthenticated = false, displayName }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggle = useCallback(() => setDrawerOpen(v => !v), []);
  const close  = useCallback(() => setDrawerOpen(false), []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  const userLabel = useMemo(
    () => displayName || (isAuthenticated ? "Account" : "Sign in"),
    [displayName, isAuthenticated]
  );

  const onBack = () => window.history.back();
  const onForward = () => window.history.forward();

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-30 h-24 bg-gradient-to-b from-neutral-50/80 to-transparent" />

      <header className="sticky top-0 z-40 border-b border-neutral-200/70 bg-white/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/55">
        <div className="mx-auto max-w-screen-2xl px-3 sm:px-4">
          <div className="flex h-14 items-center justify-between">
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

            <div className="flex items-center gap-2">
              <AuthButton
                isAuthenticated={isAuthenticated}
                displayName={userLabel}
                callbackURL="/"
                useAuthClient={true}
              />
            </div>
          </div>
        </div>
      </header>

      <MobileDrawer open={drawerOpen} onClose={close} />
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
