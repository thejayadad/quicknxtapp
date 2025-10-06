// src/lib/actions/delete-track.ts
"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { del as blobDel } from "@vercel/blob";

type ActionResult = { ok: true } | { ok: false; error: string };

function urlToKey(url?: string | null) {
  if (!url) return null;
  try {
    return new URL(url).pathname;
  } catch {
    return url;
  }
}

// 2-arg version (for useActionState)
export async function deleteTrackAction(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  return coreDelete(formData);
}

// 1-arg version (for <form action={...}>)
export async function deleteTrack(formData: FormData): Promise<void> {
  await coreDelete(formData);
}

async function coreDelete(formData: FormData): Promise<ActionResult> {
  try {
    const cookieHeader = (await cookies()).toString();
    const sessionResp = await auth.api.getSession({ headers: { cookie: cookieHeader } });
    const userId = sessionResp?.session?.userId ?? null;
    if (!userId) return { ok: false, error: "Unauthorized" };

    const id = String(formData.get("id") || "");
    if (!id) return { ok: false, error: "Missing track id" };

    const track = await prisma.track.findUnique({
      where: { id },
      select: { id: true, ownerId: true, audioUrl: true, imageUrl: true },
    });
    if (!track) return { ok: false, error: "Track not found" };
    if (track.ownerId !== userId) return { ok: false, error: "Forbidden" };

    // optional blob cleanup
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (token) {
      const tasks: Promise<any>[] = [];
      const audioKey = urlToKey(track.audioUrl);
      const imageKey = urlToKey(track.imageUrl);
      if (audioKey) tasks.push(blobDel(audioKey, { token }));
      if (imageKey) tasks.push(blobDel(imageKey, { token }));
      if (tasks.length) await Promise.allSettled(tasks);
    }

    await prisma.track.delete({ where: { id } });

    revalidatePath("/");
    revalidatePath("/library");
    revalidatePath("/dashboard/tracks");

    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e?.message ?? "Delete failed" };
  }
}
