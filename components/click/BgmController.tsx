"use client";

import { useEffect, useRef } from "react";

export function BgmController({ src }: { src: string }) {
  const bgmRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // ★ SSR（サーバー側）では Audio が存在しないので即 return
    if (typeof window === "undefined") return;

    const bgm = new Audio(src);
    bgm.loop = true;
    bgm.volume = 0.5;

    // 再生（モバイルではユーザー操作後に再生される）
    bgm.play().catch(() => {});

    bgmRef.current = bgm;

    return () => {
      bgm.pause();
      bgmRef.current = null;
    };
  }, [src]);

  return null;
}
