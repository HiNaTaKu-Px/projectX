"use client";

import { useEffect } from "react";

export default function BgmPlayerClick() {
  useEffect(() => {
    const audio = new Audio("/sounds/click/clickbgm.mp3");
    audio.loop = true;
    audio.volume = 0.5;
    audio.play();

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  return null;
}
