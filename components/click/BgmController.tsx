"use client";

import { useEffect, useRef } from "react";

export function BgmController({ src }: { src: string }) {
  const bgmRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const bgm = new Audio(src);
    bgm.loop = true;
    bgm.volume = 0.5;
    bgm.play().catch(() => {});
    bgmRef.current = bgm;

    return () => {
      bgm.pause();
    };
  }, [src]);

  return null;
}
