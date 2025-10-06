
"use client";

import Image from "next/image";
import { Heart, Pause, Play } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/helpers/cn"; // or replace with your own classnames util
import { TrackDTO } from "@/lib/track-type";
import { usePlayer } from "./PlayerProvider";

export default function TrackGrid({ tracks }: { tracks: TrackDTO[] }) {
  const player = usePlayer();
  const [likes, setLikes] = useState<Record<string, boolean>>({});

  const toggleLike = (id: string) =>
    setLikes(prev => ({ ...prev, [id]: !prev[id] }));

  const isCurrent = (id: string) => player.current?.id === id;

  const onPlay = (track: TrackDTO) => {
    // set queue once from the page
    if (player.queue.length !== tracks.length) {
      player.setQueue(tracks);
    }
    player.playTrack(track, tracks);
  };

  return (
    <ul className="grid gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
      {tracks.map((t) => {
        const playing = isCurrent(t.id) && player.isPlaying;
        return (
          <li
            key={t.id}
            className="group relative overflow-hidden rounded-xl border border-neutral-200 bg-white/70 backdrop-blur hover:shadow-md transition-shadow"
          >
            <div className="relative aspect-square w-full overflow-hidden">
              <Image
                src={t.imageUrl}
                alt={t.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width:768px) 50vw, (max-width:1200px) 33vw, 25vw"
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 flex items-end justify-between p-2 opacity-0 transition-opacity group-hover:opacity-100 bg-gradient-to-t from-black/40 via-black/10 to-transparent">
                <button
                  onClick={() => onPlay(t)}
                  className={cn(
                    "inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-neutral-900 shadow-md",
                    "hover:scale-105 active:scale-95 transition"
                  )}
                  aria-label={playing ? "Pause" : "Play"}
                >
                  {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 translate-x-[1px]" />}
                </button>

                <button
                  onClick={() => toggleLike(t.id)}
                  className={cn(
                    "inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-neutral-900 shadow",
                    likes[t.id] ? "text-rose-600" : "text-neutral-700"
                  )}
                  aria-label={likes[t.id] ? "Unlike" : "Like"}
                >
                  <Heart className={cn("h-5 w-5", likes[t.id] && "fill-rose-600")} />
                </button>
              </div>
            </div>

            <div className="p-3">
              <div className="truncate text-sm font-semibold text-neutral-900">{t.title}</div>
              <div className="truncate text-xs text-neutral-600">{t.artist ?? "Unknown artist"}</div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
