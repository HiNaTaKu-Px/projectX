import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { auth } from "@/lib/auth/lucia";
import { db } from "@/lib/db/db";
import { appUsers, posts } from "@/lib/db/schema"; // ★ posts を追加
import { eq } from "drizzle-orm";

export async function POST() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(auth.sessionCookieName)?.value ?? null;

  if (!sessionId) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  const { user, session } = await auth.validateSession(sessionId);

  if (!user || !session) {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }

  // ★ 1. まず投稿を削除（外部キー制約を回避）
  await db.delete(posts).where(eq(posts.userId, user.id));

  // ★ 2. ユーザー削除
  await db.delete(appUsers).where(eq(appUsers.id, user.id));

  // ★ 3. セッション削除
  await auth.invalidateSession(session.id);

  return NextResponse.json({ success: true });
}
