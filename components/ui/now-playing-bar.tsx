"use client";

import Image from "next/image";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { useMemo } from "react";
import { usePlayer } from "./PlayerProvider";

function format(t: number) {
  if (!Number.isFinite(t) || t <= 0) return "0:00";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function NowPlayingBar({ className = "" }: { className?: string }) {
  const player = usePlayer();
  const { current, isPlaying, currentTime, duration } = player;

  const progress = useMemo(() => {
    if (!duration || duration <= 0) return 0;
    return Math.min(100, Math.max(0, (currentTime / duration) * 100));
  }, [currentTime, duration]);

  if (!current) return null; // don’t render until a track is loaded

  const onScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = (e.target as HTMLDivElement).getBoundingClientRect();
    const x = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
    const ratio = x / rect.width;
    player.seek(ratio * (duration || 0));
  };

  return (
    <div className={`fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 ${className}`}>
      <div className="mx-auto max-w-screen-2xl px-3 sm:px-4 py-2">
        <div className="flex items-center gap-3">
          {/* Artwork + title */}
          <div className="flex min-w-0 items-center gap-2">
            <div className="relative h-10 w-10 overflow-hidden rounded">
              <Image
                src={current.imageUrl}
                alt={current.title}
                fill
                className="object-cover"
                sizes="40px"
              />
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-medium text-neutral-900">{current.title}</div>
              <div className="truncate text-xs text-neutral-600">{/* artist if you store it */}</div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <IconBtn label="Previous" onClick={player.prev}><SkipBack className="h-5 w-5" /></IconBtn>
            <IconBtn label={isPlaying ? "Pause" : "Play"} onClick={player.toggle}>
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 translate-x-[1px]" />}
            </IconBtn>
            <IconBtn label="Next" onClick={player.next}><SkipForward className="h-5 w-5" /></IconBtn>
          </div>

          {/* Progress */}
          <div className="ml-auto flex w-1/2 items-center gap-2 max-sm:hidden">
            <span className="w-10 text-right text-xs tabular-nums text-neutral-600">{format(currentTime)}</span>
            <div className="relative h-2 flex-1 cursor-pointer select-none rounded bg-neutral-200/70" onClick={onScrub}>
              <div className="absolute inset-y-0 left-0 rounded bg-neutral-800" style={{ width: `${progress}%` }} />
            </div>
            <span className="w-10 text-xs tabular-nums text-neutral-600">{format(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function IconBtn({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-900 shadow-sm hover:bg-neutral-50"
    >
      {children}
    </button>
  );
}
