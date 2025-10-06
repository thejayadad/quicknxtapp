// components/sidebar/sidebar.tsx
import Logo from "../ui/logo";
import { MAIN_NAV } from "./nav-item";
import SidebarNav from "./sidebar-nav";

import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import MyTracksSection from "./my-tracks-section";
import { getMyTracks } from "@/lib/getMyTracks";

export default async function SideBar() {
  const cookieHeader = (await cookies()).toString();

  // Better Auth: session typically contains userId
  const sessionResp = await auth.api.getSession({ headers: { cookie: cookieHeader } });
  const session: any = (sessionResp as any)?.session ?? sessionResp ?? null;
  const userId: string | null = session?.user?.id ?? session?.userId ?? null;

  let myTracks: { id: string; title: string }[] = [];
  if (userId) {
    const rows = await prisma.track.findMany({
      where: { ownerId: userId },
      select: { id: true, title: true },
      orderBy: { createdAt: "desc" },
      take: 25,
    });
    myTracks = rows;
  }
  const tracks = userId ? await getMyTracks(userId) : [];

  return (
    <aside className="hidden shrink-0 md:flex md:w-72 md:flex-col border-r border-neutral-200 bg-white/90 backdrop-blur">
      <div className="px-4 py-4">
        <Logo />
      </div>

      <SidebarNav items={MAIN_NAV} />

      {/* Collapsible "My Tracks" */}
          <MyTracksSection isAuthenticated={!!userId} tracks={tracks} />

    </aside>
  );
}
