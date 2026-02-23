"use server";

import { auth } from "@/lib/auth/lucia";
import { db } from "@/lib/db/db";
import { posts } from "@/lib/db/schema";
import { cookies } from "next/headers";
import { eq, and } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function editPostAction(postId: number, content: string) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(auth.sessionCookieName)?.value ?? null;
  if (!sessionId) return { error: "認証が必要です" };

  const { session, user } = await auth.validateSession(sessionId);
  if (!session || !user) return { error: "セッションが無効です" };

  try {
    // 更新処理
    await db
      .update(posts)
      .set({ content })
      .where(and(eq(posts.id, postId), eq(posts.userId, user.id)));

    // ★重要: これで一覧画面のデータを最新にする
    revalidatePath("/board");
  } catch (e) {
    return { error: "更新に失敗しました" };
  }

  // 成功したら一覧へ
  redirect("/board");
}
