"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type CoinEffectType = {
  id: number;
  value: number;
  x: number;
  y: number;
} | null;

export const CoinEffect = ({
  coinEffect,
  onFinish,
}: {
  coinEffect: CoinEffectType;
  onFinish: () => void;
}) => {
  if (!coinEffect) return null;

  const scale = 1 + Math.min(coinEffect.value / 50, 2);

  // ★ 3秒後に自動で消える処理
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish(); // 親に「消して」と伝える
    }, 3000);

    return () => clearTimeout(timer);
  }, [coinEffect, onFinish]);

  return (
    <AnimatePresence>
      <motion.div
        key={coinEffect.id}
        initial={{ opacity: 0, scale: scale * 0.6 }}
        animate={{ opacity: 1, scale: scale }}
        exit={{ opacity: 0, scale: scale * 0.8 }}
        transition={{ duration: 0.4 }}
        className="absolute z-50 pointer-events-none select-none"
        style={{
          top: `${coinEffect.y}%`,
          left: `${coinEffect.x}%`,
          transform: "translate(-50%, -50%)",
        }}
      >
        <div
          className="relative flex items-center justify-center"
          style={{
            width: `${40 * scale}px`,
            height: `${40 * scale}px`,
          }}
        >
          <span
            className="absolute flex items-center justify-center"
            style={{ fontSize: `${40 * scale}px` }}
          >
            💰
          </span>

          <span
            className="absolute text-white font-bold drop-shadow-[0_0_4px_rgba(0,0,0,0.8)]"
            style={{ fontSize: `${16 * scale}px` }}
          >
            +{coinEffect.value}
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
