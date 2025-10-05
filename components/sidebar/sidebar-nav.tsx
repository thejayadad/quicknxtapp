// components/sidebar/sidebar-nav.tsx
"use client";

import { usePathname } from "next/navigation";
import SidebarItem from "./sidebar-item";
import { NavItem } from "./nav-item";


export default function SidebarNav({ items }: { items?: NavItem[] }) {
  const pathname = usePathname() || "/";
  const safeItems = items ?? []; // ✅ guards undefined

  return (
    <nav className="px-2 py-1">
      <ul>
        {safeItems.map((it) => (
          <SidebarItem
            key={it.href}
            href={it.href}
            label={it.label}
            icon={it.icon}            // ✅ pass icon
            active={pathname === it.href}
          />
        ))}
      </ul>
    </nav>
  );
}
