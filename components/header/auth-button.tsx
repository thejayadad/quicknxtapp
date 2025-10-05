"use client";

import { useState } from "react";
import { Loader2, User2 } from "lucide-react";
// If you want to use authClient mode:
import { authClient } from "@/lib/auth-client";

type AuthButtonProps = {
  isAuthenticated?: boolean;
  displayName?: string | null;
  className?: string;
  callbackURL?: string;       // for redirect flow
  useAuthClient?: boolean;    // toggle: true -> use authClient.signIn.social, false -> redirect
};

export default function AuthButton({
  isAuthenticated = false,
  displayName,
  className,
  callbackURL = "/",
  useAuthClient = false,
}: AuthButtonProps) {
  const [loading, setLoading] = useState<"signin" | "signout" | null>(null);

  const signInGoogle = async () => {
    setLoading("signin");
    try {
      if (useAuthClient) {
        const { error } = await authClient.signIn.social({ provider: "google" });
        if (error) {
          console.error(error);
          // let the host page show a toast if needed
          setLoading(null);
        }
      } else {
        const url = `/api/auth/sign-in/google?callbackURL=${encodeURIComponent(callbackURL)}`;
        window.location.assign(url);
      }
    } catch (e) {
      console.error(e);
      setLoading(null);
    }
  };

  const signOut = async () => {
    setLoading("signout");
    try {
      if (useAuthClient) {
        await authClient.signOut();
        window.location.reload();
      } else {
        await fetch("/api/auth/sign-out", { method: "POST" });
        window.location.reload();
      }
    } catch (e) {
      console.error(e);
      setLoading(null);
    }
  };

  return isAuthenticated ? (
    <button
      onClick={signOut}
      disabled={loading !== null}
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm
                  bg-white/80 hover:bg-white
                  text-neutral-800 transition disabled:opacity-60 disabled:cursor-not-allowed ${className ?? ""}`}
      aria-label="Sign out"
    >
      {loading === "signout" ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <User2 className="h-4 w-4 opacity-80" />
      )}
      <span className="hidden sm:inline">{displayName ?? "Account"}</span>
      <span className="sm:hidden">Sign out</span>
    </button>
  ) : (
    <button
      onClick={signInGoogle}
      disabled={loading !== null}
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm
                  border border-neutral-200/80 bg-white/80 hover:bg-white
                  text-neutral-800 transition disabled:opacity-60 disabled:cursor-not-allowed ${className ?? ""}`}
      aria-label="Sign in with Google"
    >
      {loading === "signin" ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <GoogleGlyph className="h-4 w-4" />
      )}
      <span>Sign in</span>
    </button>
  );
}

function GoogleGlyph(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" {...props}>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.8 31.7 29.4 35 24 35c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 5.1 29.6 3 24 3 12.3 3 3 12.3 3 24s9.3 21 21 21c10.5 0 19.5-7.6 21-18v-6.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.8 16.2 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 5.1 29.6 3 24 3 15.3 3 7.8 8.4 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 45c5.3 0 10.1-2 13.6-5.2l-6.3-5.3C29.4 35 26.9 36 24 36c-5.4 0-9.8-3.3-11.6-8.1l-6.6 5.1C7.8 39.6 15.1 45 24 45z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.4-4.1 6-7.7 7.1l6.3 5.3C36.5 42.9 42 38 43.6 31.5v-11z"/>
    </svg>
  );
}
