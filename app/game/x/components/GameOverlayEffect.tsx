// @/components/x/GameOverlayEffect.tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function GameOverlayEffect() {
  const [effect, setEffect] = useState<"win" | "lose" | null>(null);

  useEffect(() => {
    const handleEffect = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setEffect(detail.type);
      setTimeout(() => setEffect(null), 2000); // 2秒で消す
    };
    window.addEventListener("game-visual-effect", handleEffect);
    return () => window.removeEventListener("game-visual-effect", handleEffect);
  }, []);

  return (
    <AnimatePresence>
      {effect && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-[100]">
          {/* 画面フラッシュ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            exit={{ opacity: 0 }}
            className={`absolute inset-0 ${effect === "win" ? "bg-yellow-400" : "bg-red-600"}`}
          />

          {/* テキスト本体 */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 100, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, y: 0, rotate: 0 }}
            exit={{ scale: 1.5, opacity: 0, transition: { duration: 0.2 } }}
            transition={{ type: "spring", damping: 10, stiffness: 100 }}
            className="relative flex flex-col items-center"
          >
            <h2
              className={`text-8xl sm:text-9xl font-black italic tracking-tighter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] ${
                effect === "win" ? "text-yellow-400" : "text-red-600"
              }`}
            >
              {effect === "win" ? "WINNER!" : "LOSER..."}
            </h2>

            {/* サブメッセージ */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-white font-bold tracking-[0.5em] text-xl mt-4 drop-shadow-md"
            >
              {effect === "win" ? "JACKPOT REACHED" : "WASTED COINS"}
            </motion.p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
