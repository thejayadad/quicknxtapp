"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers"; // 👈 add this

function dollarsToCents(val: string | number | null | undefined) {
  if (!val && val !== 0) return null;
  const n = typeof val === "string" ? parseFloat(val) : val;
  if (!Number.isFinite(n)) return null;
  return Math.round(n * 100);
}

export type UpsertTrackInput = {
  id?: string;
  title: string;
  description: string;
  imageUrl: string;
  audioUrl: string;
  tags: string[];
  key?: string | null;
  visibility: "PUBLIC" | "PRIVATE" | "UNLISTED";
  priceType: "FREE" | "PAID";
  priceDollars?: string | number | null;
};

export async function upsertTrackAction(data: UpsertTrackInput) {
  // ✅ Better Auth requires headers in server actions
  const cookieHeader = (await cookies()).toString();
  const sessionResp = await auth.api.getSession({
    headers: { cookie: cookieHeader },
  });

  const userId: string | null =
    (sessionResp as any)?.session?.user?.id ??
    (sessionResp as any)?.session?.userId ??
    null;

  if (!userId) {
    return { ok: false, error: "Not authenticated" };
  }

  if (!data.title?.trim()) return { ok: false, error: "Title is required" };
  if (!data.audioUrl) return { ok: false, error: "Audio URL is required" };
  if (!data.imageUrl) return { ok: false, error: "Image URL is required" };

  const priceCents = data.priceType === "PAID" ? dollarsToCents(data.priceDollars) : null;

  try {
    if (data.id) {
      await prisma.track.update({
        where: { id: data.id, ownerId: userId },
        data: {
          title: data.title.trim(),
          description: data.description ?? "",
          imageUrl: data.imageUrl,
          audioUrl: data.audioUrl,
          tags: data.tags ?? [],
          key: data.key ?? null,
          visibility: data.visibility,
          priceType: data.priceType,
          priceCents,
        },
      });
    } else {
      await prisma.track.create({
        data: {
          title: data.title.trim(),
          description: data.description ?? "",
          ownerId: userId,
          imageUrl: data.imageUrl,
          audioUrl: data.audioUrl,
          tags: data.tags ?? [],
          key: data.key ?? null,
          visibility: data.visibility,
          priceType: data.priceType,
          priceCents,
        },
      });
    }

    revalidatePath("/");
    revalidatePath("/library");
    return { ok: true };
  } catch (e) {
    console.error(e);
    return { ok: false, error: "Failed to save track" };
  }
}
