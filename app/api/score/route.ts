import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { db } from "@/lib/db/db";
import { scores, appUsers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth/lucia";

export async function GET() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(auth.sessionCookieName)?.value ?? null;

  if (!sessionId) return NextResponse.json([]);

  const { user } = await auth.validateSession(sessionId);
  if (!user) return NextResponse.json([]);

  // --- ① 全スコア取得
  const gameScores = await db
    .select()
    .from(scores)
    .where(eq(scores.userId, user.id));

  // --- ② クリック（coins）
  const [userData] = await db
    .select()
    .from(appUsers)
    .where(eq(appUsers.id, user.id));

  const clickScore = userData?.coins ?? 0;

  // --- ③ じゃんけんの優勝回数
  const jankenWin =
    gameScores.find((g) => g.game === "janken_wins")?.value ?? 0;

  // --- ④ 他のゲーム（じゃんけん以外）
  const otherGames = gameScores.filter(
    (g) => g.game !== "janken_wins" && g.game !== "janken_highscore",
  );

  // --- ⑤ 英語キーで返す（ScoreModal と一致）
  return NextResponse.json([
    { game: "click", value: clickScore },
    { game: "janken_wins", value: jankenWin },
    ...otherGames,
  ]);
}
