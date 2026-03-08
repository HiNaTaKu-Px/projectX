"use client";

import { useEffect, useState } from "react";
import { ClearAnimation } from "@/components/animation/ClearAnimation";
import { ResultButtons } from "@/app/game/janken/components/ResultButtons";
import { playSound } from "@/components/sound/Sound";
import { useGlobalStore } from "@/store/useGlobalStore"; // ★ 統一ストア
import { CHARACTERS, Emotion } from "@/components/avatar/avatarData"; // ★ セリフデータ
import { motion } from "framer-motion";

type Props = {
  resultState: "win" | "lose";
  showClear: boolean;
  endMessage: string;
  onHome: () => void;
  onReset: () => void;
};

export function ResultOverlay({
  resultState,
  showClear,
  endMessage,
  onHome,
  onReset,
}: Props) {
  // ★ ストアからアバター取得
  const avatar = useGlobalStore((state) => state.avatar);
  const charId = avatar.image || "1";
  const charData = CHARACTERS[charId] || CHARACTERS["1"];

  // 勝敗に応じた表情とセリフの抽選
  const emotion: Emotion = resultState === "win" ? "h" : "c";
  const [randomMessage, setRandomMessage] = useState("");

  useEffect(() => {
    // セリフの抽選
    const lines = charData.texts[emotion];
    const chosen = lines[Math.floor(Math.random() * lines.length)];
    setRandomMessage(chosen);

    // 効果音
    if (resultState === "win" && showClear) {
      playSound("/sounds/win.mp3");
    } else if (resultState === "lose") {
      playSound("/sounds/lose.mp3");
    }
  }, [resultState, showClear, charData, emotion]);

  return (
    <div className="absolute inset-0 min-h-[100dvh] pointer-events-auto z-[100]">
      {/* 背景 */}
      <div className="absolute inset-0 backdrop-blur-md bg-black/50"></div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-[100dvh] gap-4 p-4">
        {/* 勝利時の紙吹雪演出 */}
        {resultState === "win" && showClear && (
          <ClearAnimation enableSound={false} />
        )}

        {/* --- キャラクター表示エリア --- */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-3xl p-6 shadow-2xl border-4 border-gray-100 flex flex-col items-center max-w-xs w-full"
        >
          <h2
            className={`text-2xl font-black mb-4 italic ${resultState === "win" ? "text-yellow-500" : "text-blue-500"}`}
          >
            {resultState === "win" ? "YOU WIN!" : "YOU LOSE..."}
          </h2>

          {/* キャラ画像 */}
          <div className="w-32 h-32 bg-gray-50 rounded-2xl overflow-hidden mb-4 border-2 border-gray-100">
            <img
              src={`/avatars/${charId}${emotion}.png`}
              alt={charData.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `/avatars/1${emotion}.png`;
              }}
            />
          </div>

          {/* セリフ吹き出し */}
          <div
            className={`p-3 rounded-xl relative mb-4 w-full border-2 ${resultState === "win" ? "bg-yellow-50 border-yellow-200" : "bg-blue-50 border-blue-200"}`}
          >
            <p
              className={`text-[10px] font-black mb-1 ${resultState === "win" ? "text-yellow-600" : "text-blue-600"}`}
            >
              {charData.name}
            </p>
            <p className="text-sm font-bold text-gray-800 leading-tight">
              「{randomMessage}」
            </p>
          </div>

          <p className="text-xl font-black text-gray-400 mb-6 italic">
            {endMessage}
          </p>

          <ResultButtons
            resultState={resultState}
            onHome={onHome}
            onReset={onReset}
          />
        </motion.div>
      </div>
    </div>
  );
}
