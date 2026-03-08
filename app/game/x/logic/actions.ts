"use server";

import { db } from "@/lib/db/db";
import { appUsers, scores } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { validateRequest } from "@/lib/auth/lucia";

// アバターの型定義
interface AvatarData {
  mode: "image";
  image: string;
}

export async function saveGameData(
  coins: number,
  currentStreak: number,
  activeGame: string,
  gameBestScores: Record<string, number>,
  // ★ 追加: アバター情報を受け取れるようにする
  avatar?: AvatarData,
) {
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthorized");

  try {
    // 1. ユーザーの所持コインとアバターを更新
    await db
      .update(appUsers)
      .set({
        coins,
        // アバターデータがあればセットする
        ...(avatar && { avatar }),
      })
      .where(eq(appUsers.id, user.id));

    // 2. 全ゲームのハイスコアを更新 (既存のループ処理)
    const gameEntries = Object.entries(gameBestScores);

    for (const [gameName, bestValue] of gameEntries) {
      if (gameName === "none" || bestValue === 0) continue;

      const results = await db
        .select()
        .from(scores)
        .where(and(eq(scores.userId, user.id), eq(scores.game, gameName)))
        .limit(1);

      const existingScore = results[0];

      if (!existingScore) {
        await db.insert(scores).values({
          userId: user.id,
          game: gameName,
          value: bestValue,
        });
      } else if (bestValue > (existingScore.value ?? 0)) {
        await db
          .update(scores)
          .set({ value: bestValue })
          .where(eq(scores.id, existingScore.id));
      }
    }

    return { ok: true };
  } catch (error) {
    console.error("Save Error:", error);
    return { ok: false };
  }
}

export async function getGameStats() {
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthorized");

  try {
    const userData = await db.query.appUsers.findFirst({
      where: eq(appUsers.id, user.id),
    });

    const userScores = await db
      .select({
        game: scores.game,
        value: scores.value,
      })
      .from(scores)
      .where(eq(scores.userId, user.id));

    // ★ 修正: 保存されている avatar オブジェクトも返す
    return {
      ok: true,
      coins: userData?.coins ?? 0,
      avatar: userData?.avatar, // アバター情報
      scores: userScores,
    };
  } catch (error) {
    console.error("Fetch Error:", error);
    return { ok: false, coins: 0, scores: [], avatar: null };
  }
}
