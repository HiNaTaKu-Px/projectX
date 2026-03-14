// store/actions.ts (または適切な場所)
"use server";

import { db } from "@/db/db";
import { user } from "@/db/schema"; // usersテーブルにアバター情報がある場合
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";

/**
 * ユーザーのアバター設定（imageID）をDBに保存する
 */
export async function updateAvatarAction(imageID: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { success: false };

  try {
    // ユーザーテーブルの image (または avatarImage 等) カラムを更新
    // ※お使いのスキーマに合わせて column 名を変更してください
    await db.update(user)
      .set({ 
        image: imageID  // ここに "1", "2" などの文字列が入る
      })
      .where(eq(user.id, session.user.id));

    return { success: true };
  } catch (e) {
    console.error("Avatar Update Error:", e);
    return { success: false };
  }
}