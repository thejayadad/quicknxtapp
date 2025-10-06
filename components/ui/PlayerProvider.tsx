// components/player/PlayerProvider.tsx
"use client";

import { TrackDTO } from "@/lib/track-type";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

type PlayerState = {
  // keep the simple 'play' shape your cards were calling
  play: (t: { id: string; src: string; title: string; artist: string; cover: string }) => void;
  queue: TrackDTO[];
  index: number;
  isPlaying: boolean;
  current: TrackDTO | null;
  currentTime: number;
  duration: number;
  playTrack: (track: TrackDTO, queue?: TrackDTO[]) => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  seek: (seconds: number) => void;
  setQueue: (q: TrackDTO[]) => void;
};

const PlayerCtx = createContext<PlayerState | null>(null);

export default function PlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [queue, setQueue] = useState<TrackDTO[]>([]);
  const [index, setIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const current = index >= 0 && index < queue.length ? queue[index] : null;

  useEffect(() => {
    if (!audioRef.current) {
      const el = document.createElement("audio");
      el.preload = "metadata";
      const onTime = () => setCurrentTime(el.currentTime || 0);
      const onMeta = () => setDuration(el.duration || 0);
      const onEnded = () => { setIsPlaying(false); next(); };
      el.addEventListener("timeupdate", onTime);
      el.addEventListener("loadedmetadata", onMeta);
      el.addEventListener("ended", onEnded);
      audioRef.current = el;
      return () => {
        el.removeEventListener("timeupdate", onTime);
        el.removeEventListener("loadedmetadata", onMeta);
        el.removeEventListener("ended", onEnded);
      };
    }
  }, []);

  useEffect(() => {
    const el = audioRef.current;
    if (!el || !current) return;
    el.src = current.audioUrl;
    el.currentTime = 0;
    setCurrentTime(0);
    setDuration(0);
    if (isPlaying) el.play().catch(() => setIsPlaying(false));
  }, [current?.audioUrl]); // re-load when track changes

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    if (isPlaying) el.play().catch(() => setIsPlaying(false));
    else el.pause();
  }, [isPlaying]);

  const playTrack = useCallback((track: TrackDTO, q?: TrackDTO[]) => {
    if (q && q.length) {
      setQueue(q);
      const idx = q.findIndex((t) => t.id === track.id);
      setIndex(idx >= 0 ? idx : 0);
    } else {
      setQueue((prev) => {
        const exists = prev.findIndex((t) => t.id === track.id);
        if (exists >= 0) {
          setIndex(exists);
          return prev;
        }
        const nextQ = [...prev, track];
        setIndex(nextQ.length - 1);
        return nextQ;
      });
    }
    setIsPlaying(true);
  }, []);

  // small wrapper that adapts the simple shape to TrackDTO
  const play = useCallback((t: { id: string; src: string; title: string; artist: string; cover: string }) => {
    const dto: TrackDTO = {
      id: t.id,
      title: t.title,
      artist: t.artist,
      audioUrl: t.src,
      imageUrl: t.cover,
    };
    playTrack(dto);
  }, [playTrack]);

  const toggle = useCallback(() => {
    if (!current) return;
    setIsPlaying((v) => !v);
  }, [current]);

  const next = useCallback(() => {
    setIndex((i) => {
      if (queue.length === 0) return -1;
      const n = i + 1;
      return n < queue.length ? n : 0;
    });
    setIsPlaying(true);
  }, [queue.length]);

  const prev = useCallback(() => {
    setIndex((i) => {
      if (queue.length === 0) return -1;
      const p = i - 1;
      return p >= 0 ? p : queue.length - 1;
    });
    setIsPlaying(true);
  }, [queue.length]);

  const seek = useCallback((seconds: number) => {
    const el = audioRef.current;
    if (!el || !Number.isFinite(seconds)) return;
    el.currentTime = Math.min(Math.max(0, seconds), duration || 0);
    setCurrentTime(el.currentTime);
  }, [duration]);

  const value = useMemo<PlayerState>(() => ({
    play, // ✅ now provided
    queue, index, isPlaying, current, currentTime, duration,
    playTrack, toggle, next, prev, seek, setQueue,
  }), [play, queue, index, isPlaying, current, currentTime, duration, playTrack, toggle, next, prev, seek, setQueue]);

  return <PlayerCtx.Provider value={value}>{children}</PlayerCtx.Provider>;
}

export function usePlayer() {
  const ctx = useContext(PlayerCtx);
  if (!ctx) throw new Error("usePlayer must be used within <PlayerProvider>");
  return ctx;
}
