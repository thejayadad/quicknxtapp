// src/lib/get-current-user.ts
"use server";

import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type CurrentUser = {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
} | null;

export async function getCurrentUser(): Promise<CurrentUser> {
  const cookieHeader = (await cookies()).toString();

  // Better Auth returns { session: { userId, ... } } (no nested user)
  const sessionResp = await auth.api.getSession({ headers: { cookie: cookieHeader } });
  const userId = sessionResp?.session?.userId ?? null;
  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, image: true },
  });

  return user ?? null;
}
