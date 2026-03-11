"use server";

import { db } from "@/db/db"; 
import { posts } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";
import { eq, and } from "drizzle-orm";

async function getSession() {
  return await auth.api.getSession({
    headers: await headers(),
  });
}

export async function createPost(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error("ログインが必要です");

  const content = formData.get("content") as string;
  if (!content || content.trim().length === 0) return;

  await db.insert(posts).values({
    id: nanoid(),
    content: content.trim(),
    userId: session.user.id,
  });
  revalidatePath("/board");
}

export async function updatePost(postId: string, formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error("ログインが必要です");

  const content = formData.get("content") as string;
  if (!content || content.trim().length === 0) return;

  await db.update(posts)
    .set({ content: content.trim(), updatedAt: new Date() })
    .where(and(eq(posts.id, postId), eq(posts.userId, session.user.id)));

  revalidatePath("/board");
}

export async function deletePost(postId: string) {
  const session = await getSession();
  if (!session) throw new Error("ログインが必要です");

  await db.delete(posts)
    .where(and(eq(posts.id, postId), eq(posts.userId, session.user.id)));

  revalidatePath("/board");
}