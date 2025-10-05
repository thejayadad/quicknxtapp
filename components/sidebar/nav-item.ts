// components/nav/items.ts
export type IconName =
  | "home"
  | "search"
  | "library"
  | "upload"
  | "playlists"
  | "likes";

export type NavItem = {
  href: string;
  label: string;
  icon: IconName; // ✅ serializable
};

export const MAIN_NAV: NavItem[] = [
  { href: "/",          label: "Home",      icon: "home" },
  { href: "/search",    label: "Search",    icon: "search" },
  // { href: "/library",   label: "Library",   icon: "library" },
  // { href: "/upload",    label: "Upload",    icon: "upload" },
  // { href: "/playlists", label: "Playlists", icon: "playlists" },
  // { href: "/likes",     label: "Likes",     icon: "likes" },
];
