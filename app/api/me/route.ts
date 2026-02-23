import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { auth } from "@/lib/auth/lucia";
import { db } from "@/lib/db/db";
import { appUsers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(auth.sessionCookieName)?.value ?? null;

  if (!sessionId) {
    return NextResponse.json({ user: null });
  }

  const { user } = await auth.validateSession(sessionId);
  if (!user) {
    return NextResponse.json({ user: null });
  }

  // ★ query API を使わず select する
  const rows = await db.select().from(appUsers).where(eq(appUsers.id, user.id));

  const dbUser = rows[0] ?? null;

  return NextResponse.json({ user: dbUser });
}
