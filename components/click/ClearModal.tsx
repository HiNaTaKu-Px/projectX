"use client";

import { useEffect } from "react";
import { playSound } from "@/components/sound/Sound";

export function ClearModal({ onHome }: { onHome: () => void }) {
  useEffect(() => {
    playSound("/sounds/win.mp3");
  }, []);

  return (
    <div className="fixed inset-0 z-999 flex flex-col items-center justify-center">
      <div className="absolute inset-0 bg-gray-500/50 backdrop-blur-sm"></div>
      <div className="relative z-10 text-white text-3xl font-bold mb-4">
        🎉 クリアおめでとう！ 🎉
      </div>
      <button
        onClick={onHome}
        className="relative px-6 py-3 bg-green-400 text-white font-bold rounded-lg shadow-lg hover:scale-105 transition"
      >
        ホーム画面
      </button>
    </div>
  );
}
