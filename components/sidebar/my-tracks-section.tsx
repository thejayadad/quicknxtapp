// components/sidebar/MyTracksSection.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Music2, Plus } from "lucide-react";
import SlideOver from "@/components/ui/SlideOver";
import { TrackCard, TrackCardData } from "../tracks/track-card";

type Props = {
  isAuthenticated: boolean;
  tracks: TrackCardData[];
};

export default function MyTracksSection({ isAuthenticated, tracks }: Props) {
  const [open, setOpen] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  const hasTracks = isAuthenticated && tracks.length > 0;
  const openAdd = () => setShowAdd(true);
  const closeAdd = () => setShowAdd(false);

  return (
    <div className="mt-2 border-t border-neutral-200 pt-2">
      {/* Header row */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-3 py-2 text-left"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-md border border-neutral-200 bg-white">
            <Music2 className="h-4 w-4 text-neutral-700" />
          </span>
          <span className="text-sm font-medium text-neutral-900">My Tracks</span>
          {isAuthenticated && (
            <span className="ml-1 rounded bg-neutral-100 px-1.5 py-0.5 text-[11px] text-neutral-600">
              {tracks.length}
            </span>
          )}
        </div>

        <ChevronDown
          className={`h-4 w-4 text-neutral-700 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Body */}
      <div className={`${open ? "block" : "hidden"} px-3 pb-3`}>
        {!isAuthenticated ? (
          <div className="rounded-md border border-neutral-200 bg-white p-3">
            <p className="text-sm text-neutral-700">Sign in to add and manage your tracks.</p>
            <Link
              href="/sign-in"
              className="mt-2 inline-flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-sm text-neutral-800 hover:bg-neutral-50"
            >
              <Plus className="h-4 w-4" />
              <span>Sign in</span>
            </Link>
          </div>
        ) : hasTracks ? (
          <div className="space-y-2">
            <ul className="space-y-2">
              {tracks.map((t) => (
                <li key={t.id}>
                  <TrackCard track={t} />
                </li>
              ))}
            </ul>

            <div className="pt-1">
              <Link 
              href={'/upload'}
                className="inline-flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-sm text-neutral-800 hover:bg-neutral-50"
              >
                <Plus className="h-4 w-4" />
                <span>Add track</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-neutral-200 bg-white p-3">
            <p className="text-sm text-neutral-700">You don’t have any tracks yet.</p>
           <Link 
              href={'/upload'}
                className="inline-flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-sm text-neutral-800 hover:bg-neutral-50"
              >
                <Plus className="h-4 w-4" />
                <span>Add track</span>
              </Link>
          </div>
        )}
      </div>
    </div>
  );
}
