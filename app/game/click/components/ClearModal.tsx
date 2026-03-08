"use client";

import { useEffect, useState } from "react";
import { playSound } from "@/components/sound/Sound";
// ★ 修正: インポート元を @/store/useGlobalStore.ts に統一
import { useGlobalStore } from "@/store/useGlobalStore";
import { CHARACTERS } from "@/components/avatar/avatarData";
import { motion } from "framer-motion";

export function ClearModal({ onHome }: { onHome: () => void }) {
  // 新しいストアから現在のアバターを取得
  const avatar = useGlobalStore((state) => state.avatar);
  const charId = avatar.image || "1";
  const charData = CHARACTERS[charId] || CHARACTERS["1"];

  const [randomMessage, setRandomMessage] = useState("");

  useEffect(() => {
    playSound("/sounds/win.mp3");

    // 配列からランダムにセリフを選択
    const victoryLines = charData.texts.h;
    if (victoryLines && victoryLines.length > 0) {
      const chosen =
        victoryLines[Math.floor(Math.random() * victoryLines.length)];
      setRandomMessage(chosen);
    }
  }, [charData]);

  return (
    <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md"></div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative z-10 bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border-4 border-yellow-400 flex flex-col items-center"
      >
        <div className="text-yellow-500 text-2xl font-black mb-4 italic uppercase text-center">
          ✨ Stage Clear! ✨
        </div>

        {/* 選択中のアバター画像（喜び顔） */}
        <div className="w-40 h-40 bg-gray-100 rounded-2xl overflow-hidden mb-4 border-2 border-gray-200 shadow-inner">
          <img
            src={`/avatars/${charId}h.png`}
            alt={charData.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `/avatars/1h.png`;
            }}
          />
        </div>

        {/* ランダムセリフ吹き出し */}
        <div className="bg-yellow-50 border-2 border-yellow-200 p-4 rounded-xl relative mb-8 w-full">
          <p className="text-[10px] text-yellow-600 font-black mb-1">
            {charData.name}
          </p>
          <p className="text-sm font-bold text-gray-800 leading-relaxed">
            「{randomMessage}」
          </p>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-yellow-50 border-b-2 border-r-2 border-yellow-200 rotate-45"></div>
        </div>

        <button
          onClick={onHome}
          className="w-full py-4 bg-gradient-to-r from-green-400 to-green-600 text-white font-black rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all"
        >
          ホーム画面へ戻る
        </button>
      </motion.div>
    </div>
  );
}
