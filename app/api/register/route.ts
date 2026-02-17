import { NextResponse } from "next/server";
import { registerUser } from "@/lib/auth/register";
import { registerSchema } from "@/lib/validators/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // -----------------------------
    // Zod バリデーション
    // -----------------------------
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      const message =
        errors.email?.[0] ?? errors.password?.[0] ?? "入力内容が不正です";

      return NextResponse.json({ error: message }, { status: 400 });
    }

    const { email, password } = parsed.data;

    // -----------------------------
    // 登録処理
    // -----------------------------
    const result = await registerUser(email, password);

    if (!result.ok) {
      if (result.error === "duplicate") {
        return NextResponse.json(
          { error: "このユーザーは既に存在します" },
          { status: 409 },
        );
      }
      return NextResponse.json(
        { error: "登録に失敗しました" },
        { status: 500 },
      );
    }

    // -----------------------------
    // Cookie セット（成功時のみ）
    // -----------------------------
    const response = NextResponse.json({
      message: "登録成功",
      user: result.user,
    });

    if (result.sessionCookie) {
      response.cookies.set(
        result.sessionCookie.name,
        result.sessionCookie.value,
        result.sessionCookie.attributes,
      );
    }

    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
