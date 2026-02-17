import { loginUser } from "@/lib/auth/login";
import { NextResponse } from "next/server";
import { loginSchema } from "@/lib/validators/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Zod バリデーション
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      const message =
        errors.email?.[0] ?? errors.password?.[0] ?? "入力内容が不正です";

      return NextResponse.json({ error: message }, { status: 400 });
    }

    const { email, password } = parsed.data;

    // 認証処理
    const result = await loginUser(email, password);

    if (!result.ok) {
      const errorMessage =
        result.error === "not_found"
          ? "ユーザーが見つかりません"
          : "パスワードが正しくありません";

      return NextResponse.json({ error: errorMessage }, { status: 401 });
    }

    return NextResponse.json({
      message: "ログインに成功しました",
      user: result.user,
    });
  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 },
    );
  }
}
