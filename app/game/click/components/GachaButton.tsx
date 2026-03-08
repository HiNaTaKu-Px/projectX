"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { playSound } from "@/components/sound/Sound";

type Props = {
  cost: number;
  count: number;
  currentCoins: number;
  handleGacha: (count: number) => void;
  soundSrc: string;
};

export default function GachaButton({
  cost,
  count,
  currentCoins,
  handleGacha,
  soundSrc,
}: Props) {
  const [stage, setStage] = useState(0);

  const level = count === 1 ? 1 : count === 10 ? 2 : count === 100 ? 3 : 1;

  const colorClass =
    count === 1
      ? "bg-blue-500"
      : count === 10
        ? "bg-gradient-to-r from-green-400 to-blue-500"
        : count === 100
          ? "bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500"
          : "bg-gradient-to-r from-pink-500 to-yellow-400";

  const animLv1 = {
    scale: [1, 1.1, 1],
    rotate: [0, -5, 5, 0],
    transition: { duration: 0.3 },
  };

  const animLv2 = {
    scale: [1, 1.2, 0.95, 1.1, 1],
    rotate: [0, -20, 20, -10, 10, 0],
    boxShadow: [
      "0 0 0px rgba(255,255,255,0)",
      "0 0 20px rgba(255,255,255,0.8)",
      "0 0 40px rgba(255,255,255,1)",
      "0 0 20px rgba(255,255,255,0.8)",
      "0 0 0px rgba(255,255,255,0)",
    ],
    transition: { duration: 0.6 },
  };

  const animLv3 = {
    scale: [1, 1.3, 0.8, 1.2, 1],
    rotate: [0, -30, 30, -15, 15, 0],
    filter: [
      "brightness(1)",
      "brightness(2)",
      "brightness(3)",
      "brightness(2)",
      "brightness(1)",
    ],
    boxShadow: [
      "0 0 0px rgba(255,255,0,0)",
      "0 0 30px rgba(255,255,0,1)",
      "0 0 60px rgba(255,255,0,1)",
      "0 0 30px rgba(255,255,0,1)",
      "0 0 0px rgba(255,255,0,0)",
    ],
    transition: { duration: 0.8 },
  };

  const handleClick = () => {
    if (currentCoins < cost) return;

    // ★ 音ロジックを共通化
    playSound(soundSrc, 0.8);

    // ガチャ実行
    handleGacha(count);

    // アニメーション開始
    setStage(1);

    // アニメーション終了後に戻す
    const delay = level === 1 ? 300 : level === 2 ? 600 : 800;
    setTimeout(() => {
      setStage(0);
    }, delay);
  };

  const currentAnim =
    stage === 0
      ? { scale: 1, rotate: 0 }
      : level === 1
        ? animLv1
        : level === 2
          ? animLv2
          : animLv3;

  return (
    <motion.button
      onClick={handleClick}
      animate={currentAnim}
      whileHover={{ scale: 1.05 }}
      className={`
        relative overflow-hidden
        text-white font-bold px-4 py-2 rounded select-none flex flex-col items-center justify-center text-xs
        ${currentCoins < cost ? "bg-gray-400 cursor-not-allowed" : colorClass}
      `}
    >
      <motion.div
        initial={{ x: "-200%", opacity: 0 }}
        animate={
          stage > 0 ? { x: "200%", opacity: 1 } : { x: "-200%", opacity: 0 }
        }
        transition={{ duration: 0.6 }}
        className="absolute top-0 left-0 w-full h-full bg-white/40 skew-x-12 pointer-events-none"
      />

      <span>{count}回</span>
      <hr className="w-10 border-white/50 my-1" />
      <span>{cost}枚</span>
    </motion.button>
  );
}
