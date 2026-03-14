"use server";

import { db } from "@/db/db";
import { gameScores } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { and, eq } from "drizzle-orm";

export async function getClickerItemsAction() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return {};

  const record = await db.query.gameScores.findFirst({
    where: and(
      eq(gameScores.userId, session.user.id),
      eq(gameScores.gameType, "clicker_items")
    ),
  });

  return (record?.metadata as any)?.stockItems || {};
}

export async function saveClickerItemsAction(stockItems: Record<string, number>) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { success: false };

  try {
    const userId = session.user.id;
    const gameType = "clicker_items";
    const payload = { stockItems };

    const existing = await db.query.gameScores.findFirst({
      where: and(eq(gameScores.userId, userId), eq(gameScores.gameType, gameType)),
    });

    if (existing) {
      await db.update(gameScores)
        .set({ metadata: payload, createdAt: new Date() })
        .where(eq(gameScores.id, existing.id));
    } else {
      await db.insert(gameScores).values({
        id: crypto.randomUUID(),
        userId,
        gameType,
        score: 0,
        metadata: payload,
      });
    }
    return { success: true };
  } catch (e) {
    console.error("Save Error:", e);
    return { success: false };
  }
}