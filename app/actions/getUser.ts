// app/actions/getUser.ts
"use server";

import { verifyToken } from "@/lib/auth/jwt";
import { db } from "@/lib/db/db";
import { appUsers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function getUserAction(token: string) {
  if (!token) return { ok: false, error: "No token" };

  const payload = verifyToken(token);
  if (!payload) return { ok: false, error: "Invalid token" };

  const result = await db
    .select()
    .from(appUsers)
    .where(eq(appUsers.id, payload.userId));

  if (result.length === 0) {
    return { ok: false, error: "User not found" };
  }

  return { ok: true, user: result[0] };
}
