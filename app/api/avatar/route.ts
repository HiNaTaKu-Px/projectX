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

  try {
    // ★ AvatarPicker から送られてくるデータ
    const avatar = await req.json();

    // ★ 修正: colorモードの分岐を削除し、imageモードのみに統一
    // avatar.image が "1n" などの旧形式なら "n" を消して保存するガード処理付き
    const cleanImageId = avatar.image
      ? String(avatar.image).replace("n", "")
      : "1";

    await db
      .update(appUsers)
      .set({
        avatar: {
          mode: "image",
          image: cleanImageId,
        },
      })
      .where(eq(appUsers.id, user.id));

    return NextResponse.json({ success: true, image: cleanImageId });
  } catch (error) {
    console.error("Avatar Update Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
