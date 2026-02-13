// lib/auth/auth.ts
import { db } from "@/lib/db/db";
import { appUsers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { signToken } from "./jwt";

// -----------------------------
// ユーザー登録
// -----------------------------
export async function registerUser(email: string, password: string) {
  const exists = await db
    .select()
    .from(appUsers)
    .where(eq(appUsers.email, email))
    .limit(1);

  if (exists.length > 0) {
    return { ok: false, error: "duplicate" };
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await db
    .insert(appUsers)
    .values({
      email,
      password: hashed,
    })
    .returning();

  const token = signToken(user[0].id);

  return {
    ok: true,
    token,
    user: {
      id: user[0].id,
      email: user[0].email,
    },
  };
}

// -----------------------------
// ログイン
// -----------------------------
export async function loginUser(email: string, password: string) {
  const user = await db
    .select()
    .from(appUsers)
    .where(eq(appUsers.email, email))
    .limit(1);

  if (user.length === 0) {
    return { ok: false, error: "not_found" };
  }

  const ok = await bcrypt.compare(password, user[0].password);
  if (!ok) {
    return { ok: false, error: "wrong_password" };
  }

  const token = signToken(user[0].id);

  return {
    ok: true,
    token,
    user: {
      id: user[0].id,
      email: user[0].email,
    },
  };
}
