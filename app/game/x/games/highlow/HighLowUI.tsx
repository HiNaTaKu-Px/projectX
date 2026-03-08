"use client";

import { useHighLowStore } from "./useHighLowStore";
import { GameButton } from "@/app/game/x/components/GameButton";
import { PlayingCard } from "@/app/game/x/components/PlayingCard";
import { GameViewWrapper } from "@/app/game/x/components/GameViewWrapper";
import { useGlobalStore } from "../../logic/useGlobalStore";
import { useEffect } from "react";

export function HighLowUI({
  onQuit,
  onGameOver,
}: {
  onQuit: () => void;
  onGameOver: (score: number, multiplier: number) => void;
}) {
  const { currentNum, currentSuit, isProcessing, handleGuess, status } =
    useHighLowStore();
  const { streak } = useGlobalStore();

  useEffect(() => {
    if (status === "win") {
      onGameOver(streak + 1, 2.0);
    } else if (status === "loss") {
      onGameOver(0, 0);
    }
  }, [status, streak, onGameOver]);

  return (
    <GameViewWrapper
      gameTitle="High & Low"
      description="Select a chip to start High & Low"
      themeColor="blue"
      onQuit={onQuit}
    >
      <div className="flex-1 flex items-center justify-center w-full relative py-8 sm:py-12">
        {/* ★ 修正: カードの背後の影(drop-shadow)を、勝敗に合わせて色変え。動きは追加しない。 */}
        <div
          className={`relative h-full aspect-[2/3] max-h-[60vh] transition-all duration-700 ${
            status === "win"
              ? "drop-shadow-[0_0_40px_rgba(250,204,21,0.4)]" // 勝利: イエロー
              : status === "loss"
                ? "drop-shadow-[0_0_40px_rgba(220,38,38,0.4)]" // 敗北: レッド
                : "drop-shadow-[0_0_30px_rgba(59,130,246,0.2)]" // プレイ中: ブルー
          }`}
        >
          <PlayingCard rank={currentNum} suit={currentSuit} />
        </div>
      </div>

      <div className="w-full max-w-md flex gap-4 pointer-events-auto shrink-0 pb-6 px-2">
        <GameButton
          onClick={() => handleGuess("high")}
          // ★ 修正: playing以外の時はボタンを完全にロック
          disabled={isProcessing || status !== "playing"}
          variant="primary"
        >
          HIGH
        </GameButton>
        <GameButton
          onClick={() => handleGuess("low")}
          disabled={isProcessing || status !== "playing"}
          variant="danger"
        >
          LOW
        </GameButton>
      </div>
    </GameViewWrapper>
  );
}
