"use client";

import "./globals.css";
import { usePathname, useRouter } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const isHome = pathname === "/";
  const hideHeader = isHome;

  return (
    <html lang="ja">
      <body className="m-0 p-0 overflow-auto bg-gray-700">
        {/* ホーム以外はヘッダー常時表示 */}
        {!hideHeader && (
          <div className="fixed top-0 left-0 right-0 z-50">
            <header className="w-full bg-gray-700 text-white p-0  shadow-lg flex items-center">
              <button
                onClick={() => router.push("/")}
                className="text-lg font-bold hover:opacity-70 transition"
              >
                ← ホーム
              </button>
            </header>
          </div>
        )}

        {/* ★ 余白なしで子ページをそのまま表示 */}
        <div className="">{children}</div>
      </body>
    </html>
  );
}
