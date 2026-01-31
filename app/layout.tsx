"use client";

import "./globals.css";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isHockey = pathname.startsWith("/game/hockey"); // ← 追加
  const isEscape = pathname.startsWith("/game/escape");

  const hideHeader = isHome || isHockey || isEscape; // ← ここでまとめる

  const [showHeader, setShowHeader] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    if (hideHeader) return; // ← ホーム & ホッケーではスクロール制御を無効化

    const handleScroll = () => {
      const currentY = window.scrollY;

      if (currentY < lastScrollY - 10) {
        setShowHeader(true);
      } else if (currentY > lastScrollY + 10) {
        setShowHeader(false);
      }

      setLastScrollY(currentY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, hideHeader]);

  return (
    <html lang="ja">
      <body>
        {/* ホーム & ホッケーではヘッダーを完全に非表示 */}
        {!hideHeader && (
          <div
            className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
              showHeader ? "translate-y-0" : "-translate-y-full"
            }`}
          >
            <Header />
          </div>
        )}

        {/* ホーム & ホッケーでは余白を消す */}
        <div className={hideHeader ? "" : "pt-16"}>{children}</div>
      </body>
    </html>
  );
}
