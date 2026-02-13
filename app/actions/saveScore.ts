// app/actions/saveScore.ts
"use server";

import { db } from "@/lib/db/db";
import { scores } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function saveScoreAction(
  userId: number,
  game: string,
  value: number,
) {
  if (!userId || !game) return { ok: false };

  const existing = await db
    .select()
    .from(scores)
    .where(and(eq(scores.userId, userId), eq(scores.game, game)))
    .limit(1);

  if (existing.length > 0) {
    await db.update(scores).set({ value }).where(eq(scores.id, existing[0].id));
  } else {
    await db.insert(scores).values({ userId, game, value });
  }

  return { ok: true };
}
