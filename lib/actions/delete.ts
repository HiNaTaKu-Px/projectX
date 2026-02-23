"use server";

import { auth } from "@/lib/auth/lucia";
import { db } from "@/lib/db/db";
import { posts } from "@/lib/db/schema";
import { cookies } from "next/headers";
import { eq, and } from "drizzle-orm";

export async function deletePostAction(postId: number) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(auth.sessionCookieName)?.value ?? null;
  if (!sessionId) return { error: "Unauthorized" };

  const { session, user } = await auth.validateSession(sessionId);
  if (!session) return { error: "Unauthorized" };

  // ★ 投稿者本人だけ削除可能
  await db
    .delete(posts)
    .where(and(eq(posts.id, postId), eq(posts.userId, user.id)));

  return { success: true };
}
