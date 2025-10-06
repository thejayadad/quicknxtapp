// components/header/TopHeader.tsx  (SERVER)
import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import HeaderClientShell from "./HeaderClientShell";
import type { TrackCardData } from "@/components/tracks/track-card";

function toCard(t: { id: string; title: string; imageUrl: string | null; audioUrl: string }): TrackCardData {
  return {
    id: t.id,
    title: t.title,
    imageUrl: t.imageUrl ?? null,
    audioUrl: t.audioUrl,
  };
}

export default async function TopHeader() {
  const cookieHeader = (await cookies()).toString();
  const sessionResp = await auth.api.getSession({ headers: { cookie: cookieHeader } });

  const userId: string | null =
    (sessionResp as any)?.session?.user?.id ??
    (sessionResp as any)?.session?.userId ??
    null;

  let myTracks: TrackCardData[] = [];
  let displayName: string | null = null;

  if (userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        tracks: {
          orderBy: { createdAt: "desc" },
          select: { id: true, title: true, imageUrl: true, audioUrl: true },
        },
      },
    });

    displayName = user?.name ?? user?.email ?? null;
    myTracks = (user?.tracks ?? []).map(toCard);
  }

  return (
    <HeaderClientShell
      isAuthenticated={!!userId}
      displayName={displayName}
      myTracks={myTracks}
    />
  );
}
