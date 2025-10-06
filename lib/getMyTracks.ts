// lib/queries/getMyTracks.ts
import { prisma } from "@/lib/prisma";

export async function getMyTracks(ownerId: string) {
  return prisma.track.findMany({
    where: { ownerId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      audioUrl: true,   // 👈 REQUIRED for Play
      imageUrl: true,   // 👈 REQUIRED for cover
      // artist: true,   // if you have it
    },
  });
}
