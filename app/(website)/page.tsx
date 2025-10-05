import TrackGrid from "@/components/ui/tracks-grid";
import { prisma } from "@/lib/prisma";
import { TrackDTO } from "@/lib/track-type";

export default async function Home() {
  const rows = await prisma.track.findMany({
    where: { visibility: "PUBLIC" },
    orderBy: { createdAt: "desc" },
    include: { owner: { select: { name: true, email: true } } },
  });

  const tracks: TrackDTO[] = rows.map(r => ({
    id: r.id,
    title: r.title,
    artist: r.owner?.name ?? r.owner?.email?.split("@")[0] ?? null,
    imageUrl: r.imageUrl,
    audioUrl: r.audioUrl,
  }));

  return (
    <main className="mx-auto max-w-screen-2xl px-3 sm:px-4 py-6">
      <h1 className="mb-4 text-xl font-bold">Latest tracks</h1>
      <TrackGrid tracks={tracks} />
    </main>
  );
}
