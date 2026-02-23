import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { auth } from "@/lib/auth/lucia";
import { db } from "@/lib/db/db";
import { appUsers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(auth.sessionCookieName)?.value ?? null;

  if (!sessionId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { user } = await auth.validateSession(sessionId);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const avatar = await req.json();

  await db.update(appUsers).set({ avatar }).where(eq(appUsers.id, user.id));

  return NextResponse.json({ success: true });
}
