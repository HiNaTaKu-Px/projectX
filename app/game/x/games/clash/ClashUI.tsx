"use client";

import { useEffect } from "react";
import { useClashStore } from "./useClashStore";
import { useGlobalStore } from "../../logic/useGlobalStore";
import { GameButton } from "@/app/game/x/components/GameButton";
import { PlayingCard } from "@/app/game/x/components/PlayingCard";
import { GameViewWrapper } from "@/app/game/x/components/GameViewWrapper";

export function ClashUI({
  onQuit,
  onGameOver,
}: {
  onQuit: () => void;
  onGameOver: (score: number, multiplier: number) => void;
}) {
  const {
    playerCard,
    cpuCard,
    isCpuFaceUp,
    canSwap,
    battle,
    swapCard,
    isProcessing,
    status,
  } = useClashStore();

  const { streak } = useGlobalStore();

  useEffect(() => {
    if (status === "win") {
      onGameOver(1, 2.0);
    } else if (status === "loss") {
      onGameOver(0, 0);
    }
  }, [status, onGameOver]);

  return (
    <GameViewWrapper
      gameTitle="Card Clash"
      description="Select a chip to start Card Clash"
      themeColor="purple"
      onQuit={onQuit}
    >
      <div className="flex-1 w-full flex flex-col items-center justify-around py-4 relative pointer-events-auto">
        {/* 敵のカードエリア */}
        <div className="flex flex-col items-center gap-2">
          <p
            className={`text-xs font-bold tracking-[0.2em] uppercase transition-colors duration-500 ${
              status === "loss"
                ? "text-red-500 opacity-100"
                : "text-white opacity-60"
            }`}
          >
            {status === "loss" ? "Enemy Wins" : "Enemy Deck"}
          </p>

          {/* カードの揺れ(transition-transform)を維持しつつ、負けた時のスケール変化などは入れない */}
          <div className="h-[24vh] aspect-[2/3] transition-transform duration-500">
            {isCpuFaceUp ? (
              <PlayingCard rank={cpuCard.num} suit={cpuCard.suit} />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-indigo-900 to-black border-4 border-white/20 rounded-[7%] flex items-center justify-center shadow-2xl">
                <span className="text-4xl opacity-20 text-white font-black">
                  ?
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 自分のカードエリア */}
        <div className="flex flex-col items-center gap-2">
          <div className="h-[28vh] aspect-[2/3]">
            <PlayingCard rank={playerCard.num} suit={playerCard.suit} />
          </div>
          <p
            className={`text-xs font-bold tracking-[0.2em] uppercase transition-colors duration-500 ${
              status === "win" ? "text-yellow-400" : "text-blue-400"
            }`}
          >
            {status === "win" ? "Victory!" : "Your Hand"}
          </p>
        </div>
      </div>

      <div className="w-full max-w-md flex gap-4 shrink-0 pb-6 px-4 relative z-30 pointer-events-auto">
        <GameButton
          onClick={swapCard}
          disabled={!canSwap || isProcessing || status !== "playing"}
          variant="secondary"
        >
          SWAP
        </GameButton>
        <GameButton
          onClick={battle}
          disabled={isProcessing || status !== "playing"}
          variant="primary"
        >
          BATTLE
        </GameButton>
      </div>
    </GameViewWrapper>
  );
}
