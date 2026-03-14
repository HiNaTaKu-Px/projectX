"use server";

import { db } from "@/db/db";
import { gameScores } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { and, eq } from "drizzle-orm";

/**
 * じゃんけんの優勝回数を +1 加算して保存する
 */
export async function incrementJankenWinAction() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { success: false, error: "Unauthorized" };

  const userId = session.user.id;
  const gameType = "janken_wins";

  try {
    // 1. 現在の優勝回数を取得
    const existing = await db.query.gameScores.findFirst({
      where: and(eq(gameScores.userId, userId), eq(gameScores.gameType, gameType)),
    });

    if (existing) {
      // 2. すでにデータがあれば回数を +1 する
      await db.update(gameScores)
        .set({ 
          score: existing.score + 1, 
          createdAt: new Date() // 更新日時として利用
        })
        .where(eq(gameScores.id, existing.id));
    } else {
      // 3. 初めての優勝なら 1 を登録
      await db.insert(gameScores).values({
        id: crypto.randomUUID(),
        userId,
        gameType,
        score: 1,
        metadata: { firstWin: new Date().toISOString() },
      });
    }
    return { success: true };
  } catch (e) {
    console.error("Janken Save Error:", e);
    return { success: false };
  }
}

/**
 * 通算優勝回数を取得する
 */
export async function getJankenTotalWinsAction(): Promise<number> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return 0;

  const record = await db.query.gameScores.findFirst({
    where: and(
      eq(gameScores.userId, session.user.id),
      eq(gameScores.gameType, "janken_wins")
    ),
  });

  return record?.score ?? 0;
}