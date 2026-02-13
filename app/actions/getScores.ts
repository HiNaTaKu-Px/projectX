// app/actions/getScores.ts
"use server";

import { verifyToken } from "@/lib/auth/jwt";
import { db } from "@/lib/db/db";
import { scores } from "@/lib/db/schema"; // ← あなたのスコアテーブル名に合わせて変更
import { eq } from "drizzle-orm";

export async function getScoresAction(token: string) {
  if (!token) return { ok: false, scores: [] };

  const payload = verifyToken(token);
  if (!payload) return { ok: false, scores: [] };

  const result = await db
    .select()
    .from(scores)
    .where(eq(scores.userId, payload.userId));

  return { ok: true, scores: result };
}
