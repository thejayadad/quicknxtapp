// components/nav/sidebar-item.tsx
"use client";

import { cn } from "@/lib/helpers/cn";
import Link from "next/link";
import { ICONS, type IconName } from "./icons";

type Props = {
  href: string;
  label: string;
  icon: IconName;   // ✅ required
  active?: boolean;
};

export default function SidebarItem({ href, label, icon, active }: Props) {
  const Icon = ICONS[icon];

  return (
    <li>
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        className={cn(
          "group flex items-center gap-3 rounded-lg px-3 py-1 text-sm transition",
          "focus:outline-none focus:ring-2 focus:ring-neutral-400/40 focus:ring-offset-2",
          active
            ? "bg-neutral-100 text-neutral-900"
            : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
        )}
      >
        <span
          className={cn(
            "grid h-7 w-7 place-items-center rounded-md border text-neutral-700",
            active
              ? "border-neutral-300 bg-white shadow-sm"
              : "border-transparent bg-neutral-100 group-hover:border-neutral-200"
          )}
        >
          <Icon className={cn("h-4 w-4", active ? "opacity-100" : "opacity-80 group-hover:opacity-100")} />
        </span>

        <span className="truncate">{label}</span>
      </Link>
    </li>
  );
}
