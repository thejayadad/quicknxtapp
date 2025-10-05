
// src/lib/auth-client.ts
import { nextCookies } from "better-auth/next-js";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  plugins: [
    nextCookies(),       // ✅ keep this (handles cookies in Next.js)
  ],
});