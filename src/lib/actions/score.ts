"use server";

import { db } from "@/lib/db/db";
import { scores, appUsers } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, and, sql, desc } from "drizzle-orm"; // desc を追加

/**
 * 1. ユーザーの全ゲームスコアとコインを一括取得
 */
export async function getGameProfile() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return null;

  const userId = session.user.id;

  const [gameScores, [userData]] = await Promise.all([
    db.select().from(scores).where(eq(scores.userId, userId)),
    db.select().from(appUsers).where(eq(appUsers.id, userId)),
  ]);

  if (!userData) return null;

  const jankenWin =
    gameScores.find((g) => g.game === "janken_wins")?.value ?? 0;
  const otherGames = gameScores.filter(
    (g) => g.game !== "janken_wins" && g.game !== "janken_highscore",
  );

  return {
    coins: userData.coins,
    avatar: userData.avatar,
    items: userData.items,
    stockItems: userData.stockItems,
    scores: [
      { game: "click", value: userData.coins },
      { game: "janken_wins", value: jankenWin },
      ...otherGames.map((s) => ({ game: s.game, value: s.value })),
    ],
  };
}

/**
 * 2. ハイスコアを保存 (上書き型)
 */
export async function saveHighScore(game: string, value: number) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return { error: "Unauthorized" };

  const userId = session.user.id;

  const [existing] = await db
    .select()
    .from(scores)
    .where(and(eq(scores.userId, userId), eq(scores.game, game)))
    .limit(1);

  if (!existing) {
    await db.insert(scores).values({ userId, game, value });
  } else if (value > (existing.value ?? 0)) {
    await db.update(scores).set({ value }).where(eq(scores.id, existing.id));
  }

  return { success: true };
}

/**
 * 3. スコアを +1 加算 (積み上げ型)
 */
export async function incrementScore(game: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return { error: "Unauthorized" };

  const userId = session.user.id;

  const [existing] = await db
    .select()
    .from(scores)
    .where(and(eq(scores.userId, userId), eq(scores.game, game)))
    .limit(1);

  if (!existing) {
    await db.insert(scores).values({ userId, game, value: 1 });
  } else {
    await db
      .update(scores)
      .set({ value: (existing.value ?? 0) + 1 })
      .where(eq(scores.id, existing.id));
  }

  return { success: true };
}

/**
 * 4. コインを加算・減算
 */
export async function updateCoins(amount: number) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return { error: "Unauthorized" };

  const [updated] = await db
    .update(appUsers)
    .set({
      coins: sql`${appUsers.coins} + ${amount}`,
    })
    .where(eq(appUsers.id, session.user.id))
    .returning();

  return { success: true, newTotal: updated.coins };
}

/**
 * 5. ユーザーの所持品（アイテム・ストック）を更新
 */
export async function updatePlayerData({
  coins,
  items,
  stockItems,
}: {
  coins?: number;
  items?: any;
  stockItems?: any;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return { error: "Unauthorized" };

  const updatePayload: any = {};
  if (coins !== undefined) updatePayload.coins = coins;
  if (items !== undefined) updatePayload.items = JSON.stringify(items);
  if (stockItems !== undefined)
    updatePayload.stockItems = JSON.stringify(stockItems);

  await db
    .update(appUsers)
    .set(updatePayload)
    .where(eq(appUsers.id, session.user.id));

  return { success: true };
}

/**
 * 6. 各ゲームのランキングTOP3を取得
 */
export async function getRankings() {
  const [clickRanking, jankenWins, hockeyTop3, escapeTop3] = await Promise.all([
    db
      .select({ email: appUsers.email, value: appUsers.coins })
      .from(appUsers)
      .orderBy(desc(appUsers.coins))
      .limit(3),
    db
      .select({ email: appUsers.email, value: scores.value })
      .from(scores)
      .leftJoin(appUsers, eq(scores.userId, appUsers.id))
      .where(eq(scores.game, "janken_wins"))
      .orderBy(desc(scores.value))
      .limit(3),
    db
      .select({ email: appUsers.email, value: scores.value })
      .from(scores)
      .leftJoin(appUsers, eq(scores.userId, appUsers.id))
      .where(eq(scores.game, "hockey"))
      .orderBy(desc(scores.value))
      .limit(3),
    db
      .select({ email: appUsers.email, value: scores.value })
      .from(scores)
      .leftJoin(appUsers, eq(scores.userId, appUsers.id))
      .where(eq(scores.game, "escape"))
      .orderBy(desc(scores.value))
      .limit(3),
  ]);

  return {
    click: clickRanking,
    janken: jankenWins,
    hockey: hockeyTop3,
    escape: escapeTop3,
  };
}
