"use server";

import { db } from "@/db/db";
import { gameScores } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { and, eq } from "drizzle-orm";

/**
 * ハイスコアを保存するアクション
 * 引数 score が必須です
 */
export async function saveScoreAction(score: number) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { success: false, error: "Unauthorized" };

  const userId = session.user.id;
  const gameType = "escape";

  try {
    const existing = await db.query.gameScores.findFirst({
      where: and(eq(gameScores.userId, userId), eq(gameScores.gameType, gameType)),
    });

    if (existing) {
      if (score > existing.score) {
        await db.update(gameScores)
          .set({ score: score, createdAt: new Date() })
          .where(eq(gameScores.id, existing.id));
      }
    } else {
      await db.insert(gameScores).values({
        id: crypto.randomUUID(),
        userId,
        gameType,
        score,
        metadata: { lastPlayed: new Date().toISOString() },
      });
    }
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Save failed" };
  }
}

/**
 * 現在のハイスコアを取得するアクション
 * 常に number を返すようにします
 */
export async function getScoreAction(): Promise<number> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return 0;

  const record = await db.query.gameScores.findFirst({
    where: and(
      eq(gameScores.userId, session.user.id),
      eq(gameScores.gameType, "escape")
    ),
  });

  return record?.score ?? 0;
}