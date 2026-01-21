// src/app/layout.tsx
"use client";

import "./globals.css";
import { ReactNode, useEffect, useState } from "react";
import { ClickSoundProvider } from "./ClickSoundContext";

export default function RootLayout({ children }: { children: ReactNode }) {
  const [bgm] = useState(() => new Audio("/sounds/bgm.wav"));

  useEffect(() => {
    bgm.loop = true;
    bgm.volume = 0.3;
    bgm.play().catch(() => {
      console.log("BGM再生にはユーザー操作が必要な場合があります");
    });

    return () => {
      bgm.pause();
    };
  }, [bgm]);

  return (
    <html lang="ja">
      <body>
        <ClickSoundProvider>{children}</ClickSoundProvider>
      </body>
    </html>
  );
}
