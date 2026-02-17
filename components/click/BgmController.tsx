"use client";

import { useEffect, useRef } from "react";
import { playBgm } from "@/components/sound/Sound";

export function BgmController({ src }: { src: string }) {
  const bgmRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const bgm = playBgm(src, { volume: 0.5 });
    bgmRef.current = bgm;

    return () => {
      bgm.pause();
    };
  }, [src]);

  return null;
}
