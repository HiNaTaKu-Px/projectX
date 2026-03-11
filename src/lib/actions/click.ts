"use server";

import { db } from "@/db/db";
import { gameScores, user } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function saveGameData(score: number, metadata: any) {
  // 1. セッションを確実に取得
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return { error: "Unauthorized" };
  const userId = session.user.id;

  try {
    // 2. データベース更新（トランザクション的に実行）
    await db.transaction(async (tx) => {
      // ① Userテーブルのメインの所持金を更新
      await tx.update(user)
        .set({ 
          coins: score,
          updatedAt: new Date() 
        })
        .where(eq(user.id, userId));

      // ② gameScoresテーブルにアイテムや実績を保存
      const [existing] = await tx
        .select()
        .from(gameScores)
        .where(and(eq(gameScores.userId, userId), eq(gameScores.gameType, "click")))
        .limit(1);

      if (!existing) {
        await tx.insert(gameScores).values({
          id: crypto.randomUUID(),
          userId,
          gameType: "click",
          score,
          metadata,
        });
      } else {
        await tx.update(gameScores)
          .set({ score, metadata })
          .where(eq(gameScores.id, existing.id));
      }
    });

    revalidatePath("/"); // キャッシュを更新
    return { success: true };
  } catch (error) {
    console.error("DB Save Error:", error);
    return { error: "Failed to save" };
  }
}

export async function getGameProfile() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return null;
  const userId = session.user.id;

  const [scoresData, [userData]] = await Promise.all([
    db.select().from(gameScores).where(eq(gameScores.userId, userId)),
    db.select().from(user).where(eq(user.id, userId)),
  ]);

  if (!userData) return null;
  const clickData = scoresData.find((s: any) => s.gameType === "click");
  return { 
    coins: userData.coins, 
    metadata: clickData?.metadata ?? { items: Array(7).fill(null), stockItems: {} } 
  };
}