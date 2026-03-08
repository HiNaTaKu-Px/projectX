// @/components/x/GameLayout.tsx
import { useState } from "react";
import { useGlobalStore } from "@/app/game/x/logic/useGlobalStore";

interface GameLayoutProps {
  score: number;
  onQuit: () => void;
  children: React.ReactNode;
}

export function GameLayout({ score, onQuit, children }: GameLayoutProps) {
  const coins = useGlobalStore((s) => s.coins);
  const activeGame = useGlobalStore((s) => s.activeGame);
  const gameBestScores = useGlobalStore((s) => s.gameBestScores);
  const currentBest = gameBestScores[activeGame] || 0;

  const [isExiting, setIsExiting] = useState(false);

  const handleQuitClick = () => {
    setIsExiting(true);
    setTimeout(() => {
      onQuit();
    }, 600);
  };

  return (
    <div className="flex flex-col items-center h-full w-full justify-between py-4 px-4 box-border font-sans relative overflow-hidden">
      {/* 画面全体のローディングオーバーレイ */}
      {isExiting && (
        <div className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-300">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-blue-400 text-xs font-black tracking-[0.3em] animate-pulse uppercase">
              Saving Data...
            </p>
          </div>
        </div>
      )}

      {/* 1. ヘッダー領域 */}
      <div className="w-full flex justify-between items-start pointer-events-auto px-2 shrink-0 z-50">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <button
              onClick={handleQuitClick}
              disabled={isExiting}
              className="px-4 py-2 bg-black/40 hover:bg-red-600 rounded-lg border border-white/20 transition-all text-sm font-bold text-white shadow-lg active:scale-95 disabled:opacity-50"
            >
              QUIT
            </button>

            {/* --- ★ ここをMenuViewと同じスタイルに変更 --- */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 border border-yellow-500/40 rounded-full backdrop-blur-md shadow-[0_0_15px_rgba(234,179,8,0.1)]">
              {/* Windows対応の自作コインアイコン */}
              <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center border border-yellow-200 shadow-[0_0_5px_rgba(234,179,8,0.5)]">
                <span className="text-yellow-900 font-black text-[10px] leading-none">
                  C
                </span>
              </div>
              <span className="text-white font-black text-sm tabular-nums tracking-tight">
                {coins.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* スコアボード */}
        <div className="flex flex-col items-end shrink-0">
          <div className="bg-black/40 backdrop-blur-xl px-5 py-3 rounded-2xl border border-white/20 shadow-[0_0_20px_rgba(0,0,0,0.3)] min-w-[130px]">
            {/* 現在の連勝 (Streak) */}
            <div className="text-right border-b border-white/10 pb-2 mb-2">
              <p className="text-[10px] font-black opacity-60 uppercase text-blue-400 tracking-[0.2em] leading-none mb-1">
                Streak
              </p>
              <p className="text-4xl font-[1000] tabular-nums text-white leading-none drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                {score}
              </p>
            </div>

            {/* 自己ベスト (Best) */}
            <div className="text-right flex items-end justify-between gap-4">
              <p className="text-[9px] font-black opacity-50 uppercase text-white tracking-widest leading-none pb-0.5">
                Best
              </p>
              <p className="text-xl font-black tabular-nums text-yellow-500 leading-none">
                {currentBest}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. メイン・コンテンツ */}
      <div className="flex-1 w-full flex flex-col items-center justify-center relative min-h-0">
        {children}
      </div>
    </div>
  );
}
