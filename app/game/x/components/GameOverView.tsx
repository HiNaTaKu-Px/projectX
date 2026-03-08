"use client";
import { useState, useEffect } from "react"; // ★ useState, useEffect を追加
import { useGlobalStore } from "../logic/useGlobalStore";
import { CHARACTERS, Emotion } from "@/components/avatar/avatarData";
import { motion } from "framer-motion";

interface GameOverViewProps {
  score: number;
  highscore: number;
  multiplier: number;
  onRetry: () => void;
}

export function GameOverView({
  score,
  highscore,
  multiplier,
  onRetry,
}: GameOverViewProps) {
  const avatar = useGlobalStore((state) => state.avatar);
  const charId = avatar.image || "1";
  const emotionSuffix: Emotion = multiplier > 0 ? "h" : "c";
  const charData = CHARACTERS[charId] || CHARACTERS["1"];

  // ★ 追加: ランダムに選ばれたセリフを保持するステート
  const [displayText, setDisplayText] = useState("");

  // ★ 追加: コンポーネントが表示された瞬間にランダムでセリフを1つ選ぶ
  useEffect(() => {
    const textOptions = charData.texts[emotionSuffix];
    if (Array.isArray(textOptions)) {
      const randomIndex = Math.floor(Math.random() * textOptions.length);
      setDisplayText(textOptions[randomIndex]);
    } else {
      // 万が一配列でない場合のフォールバック
      setDisplayText(textOptions);
    }
  }, [charData, emotionSuffix]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2, duration: 0.5 }}
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 pointer-events-auto"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ delay: 1.3, type: "spring" }}
        className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border-4 border-gray-200"
      >
        <h2
          className={`text-3xl font-black mb-2 italic text-center uppercase ${
            multiplier > 0 ? "text-yellow-500" : "text-red-600"
          }`}
        >
          {multiplier > 0 ? "Victory!" : "Game Result"}
        </h2>

        {/* キャラクター画像表示 */}
        <div className="w-44 h-44 mx-auto mb-4 bg-gray-50 rounded-2xl overflow-hidden border-2 border-gray-100 shadow-inner">
          <img
            src={`/avatars/${charId}${emotionSuffix}.png`}
            className="w-full h-full object-cover"
            alt={charData.name}
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                `/avatars/1${emotionSuffix}.png`;
            }}
          />
        </div>

        {/* メッセージエリア */}
        <div
          className={`border-2 p-3 rounded-xl relative mb-6 ${
            multiplier > 0
              ? "bg-yellow-50 border-yellow-200"
              : "bg-blue-50 border-blue-200"
          }`}
        >
          <p
            className={`text-[10px] font-black mb-1 ${
              multiplier > 0 ? "text-yellow-600" : "text-blue-500"
            }`}
          >
            {charData.name}
          </p>
          <p className="text-sm font-bold text-gray-800 leading-tight">
            {/* ★ 修正: ランダムに選ばれた displayText を表示 */}「{displayText}
            」
          </p>
        </div>

        <div className="pt-2">
          <button
            onClick={onRetry}
            className="w-full py-4 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 active:scale-95 transition-all shadow-[0_4px_0_rgb(30,58,138)] active:shadow-none active:translate-y-1"
          >
            ベット画面に戻る
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
