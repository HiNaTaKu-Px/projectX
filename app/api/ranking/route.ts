import { NextResponse } from "next/server";
import { db } from "@/lib/db/db";
import { scores, appUsers } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  try {
    const result: any = {};

    // -----------------------------
    // ★ click（coins）ランキング
    // -----------------------------
    const clickRanking = await db
      .select({
        email: appUsers.email,
        value: appUsers.coins,
      })
      .from(appUsers)
      .orderBy(desc(appUsers.coins))
      .limit(3);

    result["click"] = clickRanking;

    // -----------------------------
    // ★ じゃんけん（優勝回数のみ）
    // -----------------------------
    const jankenWins = await db
      .select({
        value: scores.value,
        email: appUsers.email,
      })
      .from(scores)
      .leftJoin(appUsers, eq(scores.userId, appUsers.id))
      .where(eq(scores.game, "janken_wins"))
      .orderBy(desc(scores.value))
      .limit(3);

    result["janken"] = jankenWins;

    // -----------------------------
    // ★ hockey
    // -----------------------------
    const hockeyTop3 = await db
      .select({
        value: scores.value,
        email: appUsers.email,
      })
      .from(scores)
      .leftJoin(appUsers, eq(scores.userId, appUsers.id))
      .where(eq(scores.game, "hockey"))
      .orderBy(desc(scores.value))
      .limit(3);

    result["hockey"] = hockeyTop3;

    // -----------------------------
    // ★ escape
    // -----------------------------
    const escapeTop3 = await db
      .select({
        value: scores.value,
        email: appUsers.email,
      })
      .from(scores)
      .leftJoin(appUsers, eq(scores.userId, appUsers.id))
      .where(eq(scores.game, "escape"))
      .orderBy(desc(scores.value))
      .limit(3);

    result["escape"] = escapeTop3;

    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
