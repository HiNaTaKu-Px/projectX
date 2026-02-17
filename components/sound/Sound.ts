// sound.ts
"use client";

export function playSound(src: string, volume: number = 1) {
  const audio = new Audio(src);
  audio.volume = volume;
  audio.play().catch(() => {});
}

export function playBgm(src: string, options?: { volume?: number }) {
  const audio = new Audio(src);
  audio.loop = true;
  audio.volume = options?.volume ?? 0.5;
  audio.play().catch(() => {});
  return audio; // 停止したいときに使える
}
