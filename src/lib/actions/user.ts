"use server";

import { auth } from "@/lib/auth";
import { db } from "@/db/db";
import { user as userTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

export async function updateCoinsAction(coins: number) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { ok: false };

  try {
    await db.update(userTable).set({ coins }).where(eq(userTable.id, session.user.id));
    return { ok: true };
  } catch (e) {
    return { ok: false };
  }
}