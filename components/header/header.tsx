import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import HeaderClientShell from "./HeaderClientShell";

export default async function TopHeader() {
  const cookieHeader = (await cookies()).toString();

  // Better Auth session usually has only userId
  const sessionResp = await auth.api.getSession({ headers: { cookie: cookieHeader } });
  const session: any = (sessionResp as any)?.session ?? sessionResp ?? null;

  const userId: string | null = session?.user?.id ?? session?.userId ?? null;

  let displayName: string | null = null;
  let username: string | null = null;

  if (userId) {
    const u = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true },
    });

    displayName = u?.name ?? u?.email ?? null;
    // username for the brand: prefer name; otherwise email local part
    username = u?.name ?? (u?.email ? u.email.split("@")[0] : null);
  }

  return (
    <HeaderClientShell
      isAuthenticated={Boolean(userId)}
      displayName={displayName}
      username={username || ""}
    />
  );
}
