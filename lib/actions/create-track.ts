// src/lib/actions/create-track.ts
"use server";

import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "../current-user";
import { redirect } from "next/navigation";
import { error } from "console";

type Visibility = "PUBLIC" | "UNLISTED" | "PRIVATE";
type PriceType = "FREE" | "PAID";
export type ActionResult<T> = { ok: true; data: T } | { ok: false; error: string };

const createTrackSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(5000).optional().nullable(),
  tagsCsv: z.string().optional().nullable(),
  key: z.string().max(20).optional().nullable(),
  visibility: z.enum(["PUBLIC", "UNLISTED", "PRIVATE"]).default("PUBLIC"),
  isFree: z.boolean().optional(),
  priceDollars: z.string().optional().nullable(),
});

function dollarsToCents(s: string | null | undefined, isFree: boolean): number | null {
  if (isFree) return null;
  if (!s) return null;
  const n = Number(String(s).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? Math.round(n * 100) : null;
}

function splitCsv(csv: string | null | undefined): string[] {
  return (csv ?? "")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);
}

export async function createTrackAction(
  _prev: ActionResult<{ id: string; title: string }> | null,
  formData: FormData
): Promise<ActionResult<{ id: string; title: string }>> {
  try {
    // ✅ get the real user from userId
    const user = await getCurrentUser();
    if (!user) return { ok: false, error: "Unauthorized" };

    const parsed = createTrackSchema.parse({
      title: (formData.get("title") as string | null)?.trim() ?? "",
      description: ((formData.get("description") as string) || "").trim() || null,
      tagsCsv: ((formData.get("tagsCsv") as string) || "").trim() || null,
      key: ((formData.get("key") as string) || "").trim() || null,
      visibility: (formData.get("visibility") as Visibility) || "PUBLIC",
      isFree: formData.get("isFree") === "on",
      priceDollars: (formData.get("priceDollars") as string) ?? null,
    });

    const tags = splitCsv(parsed.tagsCsv);
    const priceType: PriceType = parsed.isFree ? "FREE" : "PAID";
    const priceCents = dollarsToCents(parsed.priceDollars, !!parsed.isFree);

    const audioFile = formData.get("audioFile") as File | null;
    const coverFile = formData.get("coverFile") as File | null;
    if (!audioFile || audioFile.size === 0) return { ok: false, error: "Audio file is required" };

    const audio = await put(`audio/${Date.now()}-${audioFile.name}`, audioFile, {
      access: "public",
      addRandomSuffix: true,
      contentType: audioFile.type || "audio/mpeg",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    let imageUrl = "";
    if (coverFile && coverFile.size > 0) {
      const cover = await put(`covers/${Date.now()}-${coverFile.name}`, coverFile, {
        access: "public",
        addRandomSuffix: true,
        contentType: coverFile.type || "image/jpeg",
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
      imageUrl = cover.url;
    }

    const created = await prisma.track.create({
      data: {
        title: parsed.title,
        description: parsed.description ?? "",
        ownerId: user.id,          // ✅ from getCurrentUser()
        audioUrl: audio.url,
        imageUrl,
        tags,
        key: parsed.key || null,
        visibility: parsed.visibility,
        priceType,
        priceCents,
      },
      select: { id: true, title: true },
    });

    revalidatePath("/");

  } catch (e: any) {
    console.log("Error " + error)
    return { ok: false, error: e?.message ?? "Failed to create track" };
  }
      redirect('/')

}
