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
  const pathname = usePathname(); // ← 追加
  const isHome = pathname === "/"; // ← ホーム判定

  const [showHeader, setShowHeader] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    if (isHome) return; // ← ホームではスクロール制御を無効化

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
  }, [lastScrollY, isHome]);

  return (
    <html lang="ja">
      <body>
        {/* ホームではヘッダーを完全に非表示 */}
        {!isHome && (
          <div
            className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
              showHeader ? "translate-y-0" : "-translate-y-full"
            }`}
          >
            <Header />
          </div>
        )}

        {/* ホームでは余白を消す */}
        <div className={isHome ? "" : "pt-16"}>{children}</div>
      </body>
    </html>
  );
}
