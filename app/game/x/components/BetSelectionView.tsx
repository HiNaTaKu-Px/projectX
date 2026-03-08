// @/app/game/x/components/BetSelectionView.tsx
"use client";

import { useGlobalStore } from "@/app/game/x/logic/useGlobalStore";

interface BetSelectionViewProps {
  gameTitle: string;
  description: string;
  themeColor: "blue" | "purple" | "orange";
  onPlaceBet: (amount: number) => void;
}

export function BetSelectionView({
  gameTitle,
  description,
  themeColor,
  onPlaceBet,
}: BetSelectionViewProps) {
  const coins = useGlobalStore((s) => s.coins);

  // 各カラーの「光」の強さを調整
  const colorConfig = {
    blue: {
      text: "text-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]",
      chip: "bg-blue-600 border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.4)]",
      border: "border-blue-500",
    },
    purple: {
      text: "text-purple-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]",
      chip: "bg-purple-600 border-purple-400 shadow-[0_0_20px_rgba(147,51,234,0.4)]",
      border: "border-purple-500",
    },
    orange: {
      text: "text-orange-400 drop-shadow-[0_0_15px_rgba(249,115,22,0.8)]",
      chip: "bg-orange-600 border-orange-400 shadow-[0_0_20px_rgba(234,88,12,0.4)]",
      border: "border-orange-500",
    },
  };

  const currentTheme = colorConfig[themeColor];

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-10 w-full animate-in fade-in zoom-in duration-300">
      {/* --- タイトル部分：ここをくっきり＆重厚に --- */}
      <div className="text-center relative">
        <h2
          className={`text-5xl sm:text-6xl font-[1000] italic mb-3 uppercase tracking-tighter select-none ${currentTheme.text}`}
          style={{ WebkitTextStroke: "1px rgba(255,255,255,0.1)" }}
        >
          {gameTitle}
        </h2>
        <div className="flex items-center justify-center gap-4">
          <div
            className={`h-[1px] w-8 bg-gradient-to-r from-transparent to-white/30`}
          />
          <p className="text-white/60 text-[10px] font-black tracking-[0.4em] uppercase italic">
            {description}
          </p>
          <div
            className={`h-[1px] w-8 bg-gradient-to-l from-transparent to-white/30`}
          />
        </div>
      </div>

      {/* チップ選択エリア */}
      <div className="grid grid-cols-2 gap-6 sm:gap-8 pointer-events-auto">
        {[1000, 5000, 10000, 100000].map((amount) => (
          <button
            key={amount}
            disabled={coins < amount}
            onClick={() => onPlaceBet(amount)}
            className={`
              w-24 h-24 sm:w-32 sm:h-32 rounded-full border-[5px] flex flex-col items-center justify-center font-[1000] transition-all relative overflow-hidden group
              ${
                coins >= amount
                  ? `${currentTheme.chip} text-white hover:scale-110 active:scale-95 shadow-2xl`
                  : "bg-gray-900/80 border-gray-800 text-gray-700 opacity-40 cursor-not-allowed"
              }
            `}
          >
            <span className="text-[10px] sm:text-xs opacity-60 mb-0.5 tracking-widest font-bold">
              CHIP
            </span>
            <span
              className={`
                tracking-tighter leading-none tabular-nums
                ${amount >= 100000 ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl"}
              `}
            >
              {amount.toLocaleString()}
            </span>

            {/* チップの光沢演出 */}
            {coins >= amount && (
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
