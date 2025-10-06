// components/tracks/TrackCard.tsx
"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import { usePlayer } from "../ui/PlayerProvider";
import { DeleteTrackButton } from "./delete-track";


export type TrackCardData = {
  id: string;
  title: string;
  artist?: string | null;
  audioUrl: string | null;
  imageUrl: string | null;
};

export function TrackCard({ track }: { track: TrackCardData }) {
  const { playTrack } = usePlayer();

  const canPlay = !!track.audioUrl;
  const cover = track.imageUrl || ""; // guard for <Image/>

  return (
    <div className="group relative flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-2 shadow-sm hover:shadow-md">
      {/* Avatar / cover (left) */}
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-neutral-100 ring-1 ring-neutral-200">
        {cover ? (
          <Image
            src={cover}
            alt={track.title}
            fill
            sizes="80px"
            className="object-cover"
          />
        ) : (
          // simple placeholder
          <div className="flex h-full w-full items-center justify-center text-xs text-neutral-400">
            80 × 80
          </div>
        )}
      </div>

      {/* Title + subtitle (center) */}
      <div className="min-w-0">
        <p className="truncate text-[15px] font-semibold text-neutral-900">
          {track.title}
        </p>
        <p className="truncate text-sm text-neutral-500">
          {track.artist ?? "—"}
        </p>
      </div>

      {/* Actions (right, show on hover) */}
      <div className="ml-auto flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          type="button"
          title={canPlay ? "Play" : "No audio"}
          disabled={!canPlay}
          onClick={() =>
            canPlay &&
            playTrack({
              id: track.id,
              title: track.title,
              artist: track.artist ?? "Unknown",
              audioUrl: track.audioUrl!,        // safe after canPlay
              imageUrl: track.imageUrl || "",   // ok if empty
            })
          }
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-50"
        >
          <Play className="h-4 w-4" />
        </button>

        <DeleteTrackButton id={track.id} />
      </div>
    </div>
  );
}
