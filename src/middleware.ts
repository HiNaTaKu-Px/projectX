import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";

const intlMiddleware = createMiddleware({
  locales: ["ja", "en"],
  defaultLocale: "ja",
  localeDetection: true,
});

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get("better-auth.session_token") || 
                        request.cookies.get("__Secure-better-auth.session_token");

  // 言語プレフィックスを除去したパス
  const purePathname = pathname.replace(/^\/(ja|en)/, "") || "/";
  const segments = pathname.split("/");
  const locale = ["ja", "en"].includes(segments[1]) ? segments[1] : "ja";

  // 1. 認証が必要な範囲（トップページ、ダッシュボード、ゲーム）
  const isProtectedPage = 
    purePathname === "/" || 
    purePathname.startsWith("/dashboard") || 
    purePathname.startsWith("/game");

  // 2. ログイン済みなら表示させない範囲
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

  // 【B】ログイン済みでログイン画面へアクセス → トップページ（島）へリダイレクト
  if (sessionCookie && isAuthPage) {
    return NextResponse.redirect(new URL(`/${locale}/`, request.url));
  }

  // ★重要：ログイン済みで "/" にアクセスした場合は、リダイレクトせずに
  // そのまま intlMiddleware に流すことで [locale]/page.tsx が表示されます。
  return intlMiddleware(request);
}

export const config = {
  // 動作を軽くするため、静的ファイル（画像・favicon等）を確実に除外
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};