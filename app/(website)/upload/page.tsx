// app/upload/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";               // keep the same import you use elsewhere
import TrackUpsertForm from "@/components/tracks/TrackUpsertForm";

export const metadata = {
  title: "Upload Track",
  description: "Add a new track to your library",
};

export default async function UploadPage() {
  // Better Auth requires headers in server components/actions:
  const cookieHeader = (await cookies()).toString();
  const sessionResp = await auth.api.getSession({ headers: { cookie: cookieHeader } });

  // Better Auth can return { session: { userId } } or { session: { user: { id } } }
  const session: any = (sessionResp as any)?.session ?? sessionResp ?? null;
  const userId: string | null =
    session?.user?.id ?? session?.userId ?? null;

  // If no user — bounce
  if (!userId) redirect("/");

  return (
    <main className="h-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto w-full max-w-screen-2xl px-4 py-2 sm:px-6">
        <h1 className="mb-6 text-xl font-semibold text-neutral-900">Upload a New Track</h1>
        <TrackUpsertForm />
      </div>
    </main>
  );
}
