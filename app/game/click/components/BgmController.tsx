"use client";

import { useEffect, useRef } from "react";
import { playBgm } from "@/components/sound/Sound";

export function BgmController({
  src,
  stop = false,
}: {
  src: string;
  stop?: boolean;
}) {
  const bgmRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (stop) {
      bgmRef.current?.pause();
      return;
    }

    const bgm = playBgm(src, { volume: 0.5 });
    bgmRef.current = bgm;

    return () => {
      bgm.pause();
    };
  }, [src, stop]);

  return null;
}
