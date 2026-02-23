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

  // ★ AvatarPicker から送られてくるデータ
  const avatar = await req.json();

  // ★ mode によって保存内容が変わる
  if (avatar.mode === "color") {
    // カラーモード
    await db
      .update(appUsers)
      .set({
        avatar: {
          mode: "color",
          hair: avatar.hair,
          clothes: avatar.clothes,
          bg: avatar.bg,
        },
      })
      .where(eq(appUsers.id, user.id));
  } else if (avatar.mode === "image") {
    // 画像モード
    await db
      .update(appUsers)
      .set({
        avatar: {
          mode: "image",
          image: avatar.image,
        },
      })
      .where(eq(appUsers.id, user.id));
  } else {
    return NextResponse.json({ error: "Invalid avatar mode" }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
