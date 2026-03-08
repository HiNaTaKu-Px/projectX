"use client";

import { useEffect, useState } from "react";
import { useGlobalStore } from "@/store/useGlobalStore"; // ★ 統一ストア
import { CHARACTERS, Emotion } from "@/components/avatar/avatarData";
import { motion } from "framer-motion";

export function ResetButton({
  onReset,
  onBack,
  resultState, // ★ 引数を追加
}: {
  onReset: () => void;
  onBack: () => void;
  resultState: "win" | "lose";
}) {
  const avatar = useGlobalStore((state) => state.avatar);
  const charId = avatar.image || "1";
  const charData = CHARACTERS[charId] || CHARACTERS["1"];

  const emotion: Emotion = resultState === "win" ? "h" : "c";
  const [randomMessage, setRandomMessage] = useState("");

  useEffect(() => {
    const lines = charData.texts[emotion];
    const chosen = lines[Math.floor(Math.random() * lines.length)];
    setRandomMessage(chosen);
  }, [charData, emotion]);

  return (
    <div className="absolute inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl border-4 border-gray-100 flex flex-col items-center"
      >
        <h2
          className={`text-3xl font-black mb-4 italic uppercase ${
            resultState === "win" ? "text-yellow-500" : "text-blue-600"
          }`}
        >
          {resultState === "win" ? "Victory!" : "Game Over"}
        </h2>

        {/* キャラクター画像 */}
        <div className="w-36 h-36 bg-gray-50 rounded-3xl overflow-hidden mb-4 border-2 border-gray-100 shadow-inner">
          <img
            src={`/avatars/${charId}${emotion}.png`}
            className="w-full h-full object-cover"
            alt={charData.name}
            onError={(e) => {
              (e.target as HTMLImageElement).src = `/avatars/1${emotion}.png`;
            }}
          />
        </div>

        {/* セリフ吹き出し */}
        <div
          className={`border-2 p-4 rounded-2xl relative mb-8 w-full ${
            resultState === "win"
              ? "bg-yellow-50 border-yellow-200"
              : "bg-blue-50 border-blue-200"
          }`}
        >
          <p
            className={`text-[10px] font-black mb-1 ${
              resultState === "win" ? "text-yellow-600" : "text-blue-500"
            }`}
          >
            {charData.name}
          </p>
          <p className="text-sm font-bold text-gray-800 leading-tight">
            「{randomMessage}」
          </p>
          <div
            className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 border-b-2 border-r-2 ${
              resultState === "win"
                ? "bg-yellow-50 border-yellow-200"
                : "bg-blue-50 border-blue-200"
            }`}
          ></div>
        </div>

        {/* ボタン群 */}
        <div className="grid grid-cols-2 gap-4 w-full">
          <button
            onClick={onReset}
            className="py-4 bg-blue-600 text-white font-black rounded-2xl shadow-[0_4px_0_rgb(30,58,138)] active:shadow-none active:translate-y-1 transition-all"
          >
            RETRY
          </button>
          <button
            onClick={onBack}
            className="py-4 bg-gray-200 text-gray-700 font-black rounded-2xl shadow-[0_4px_0_rgb(156,163,175)] active:shadow-none active:translate-y-1 transition-all"
          >
            HOME
          </button>
        </div>
      </motion.div>
    </div>
  );
}
