
// components/header/mobile-now-playing-bar.tsx
"use client";

import Image from "next/image";
import { Play, Pause } from "lucide-react";
import { useMemo } from "react";

type Props = {
  className?: string;
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

export default function MobileNowPlayingBar({
  className,
  nowPlaying,
  onTogglePlay,
  onScrub,
}: Props) {
  const progressPct = useMemo(() => {
    if (!nowPlaying?.durationMs) return 0;
    const p = Math.max(0, Math.min(1, (nowPlaying.progressMs ?? 0) / nowPlaying.durationMs));
    return p * 100;
  }, [nowPlaying?.progressMs, nowPlaying?.durationMs]);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/65 ${className ?? ""}`}
    >
      <div className="mx-auto max-w-7xl px-3 py-2">
        <div className="flex items-center gap-3">
          {/* Artwork */}
          <div className="relative h-10 w-10 overflow-hidden rounded-md bg-neutral-200">
            {nowPlaying?.artworkUrl ? (
              <Image
                src={nowPlaying.artworkUrl}
                alt=""
                fill
                className="object-cover"
                sizes="40px"
              />
            ) : null}
          </div>

          {/* Title/Artist */}
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] font-medium text-neutral-900">
              {nowPlaying?.title ?? "Not playing"}
            </div>
            <div className="truncate text-xs text-neutral-600">
              {nowPlaying?.artist ?? "—"}
            </div>
          </div>

          {/* Play/Pause */}
          <button
            onClick={onTogglePlay}
            aria-label={nowPlaying?.isPlaying ? "Pause" : "Play"}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white shadow-sm"
          >
            {nowPlaying?.isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5 translate-x-[1px]" />
            )}
          </button>
        </div>

        {/* Progress bar */}
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-neutral-200">
          <div
            className="h-full bg-neutral-900 transition-[width]"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
