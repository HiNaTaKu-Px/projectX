"use client";

import { useEffect } from "react";

export function useAudioPlayer(
  src: string,
  options?: { loop?: boolean; volume?: number; trigger?: boolean },
) {
  const { loop = false, volume = 1, trigger = true } = options || {};

  useEffect(() => {
    if (!trigger) return;

    const audio = new Audio(src);
    audio.loop = loop;
    audio.volume = volume;
    audio.play();

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [src, loop, volume, trigger]);
}
