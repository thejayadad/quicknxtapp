"use client";

import { Home, Search, Library, UploadCloud, ListMusic, Heart } from "lucide-react";

export const ICONS = {
  home: Home,
  search: Search,
  library: Library,
  upload: UploadCloud,
  playlists: ListMusic,
  likes: Heart,
} as const;

// 👇 derive the union type from the keys of ICONS
export type IconName = keyof typeof ICONS;
