import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";

const intlMiddleware = createMiddleware({
  locales: ["ja", "en"],
  defaultLocale: "ja",
  localeDetection: true,
});

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. 【最優先】静的ファイルやAPIへのアクセスは、認証ロジックを通さず即座に終了
  // 拡張子（.）が含まれるパスや、/_next/, /api/ などはここでスルーさせます
  if (
    pathname.includes('.') || 
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon.ico')
  ) {
    return intlMiddleware(request);
  }

  // Better Auth のセッションクッキーを確認
  const sessionCookie = request.cookies.get("better-auth.session_token") || 
                        request.cookies.get("__Secure-better-auth.session_token");

  // 言語プレフィックスを除去したパスの判定用
  const purePathname = pathname.replace(/^\/(ja|en)/, "") || "/";
  const segments = pathname.split("/");
  const locale = ["ja", "en"].includes(segments[1]) ? segments[1] : "ja";

  // 2. 認証が必要な範囲
  const isProtectedPage = 
    purePathname === "/" || 
    purePathname.startsWith("/dashboard") || 
    purePathname.startsWith("/game") ||
    purePathname.startsWith("/ranking");

  // 3. 認証済みなら表示させない範囲（ログイン・会員登録系）
  const isAuthPage = 
    purePathname.startsWith("/login") || 
    purePathname.startsWith("/register") || 
    purePathname.startsWith("/signup");

  // --- 判定ロジック ---

  // 【A】未ログインで保護ページへアクセス → ログイン画面へリダイレクト
  if (!sessionCookie && isProtectedPage) {
    if (!isAuthPage) {
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    }
  }

  // 【B】ログイン済みでログイン画面へアクセス → トップ（ゲーム島）へリダイレクト
  if (sessionCookie && isAuthPage) {
    return NextResponse.redirect(new URL(`/${locale}/`, request.url));
  }

  // 最後に多言語ミドルウェアを実行（パスの書き換えなど）
  return intlMiddleware(request);
}

export const config = {
  // ミドルウェアを起動させるパスのパターンを指定
  // 静的ファイル（拡張子あり）を最初から除外する正規表現に更新
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};