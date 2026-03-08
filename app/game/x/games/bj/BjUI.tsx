"use client";

import { useEffect } from "react";
import { useBjStore } from "./useBjStore";
import { useGlobalStore } from "../../logic/useGlobalStore";
import { GameButton } from "@/app/game/x/components/GameButton";
import { PlayingCard } from "@/app/game/x/components/PlayingCard";
import { GameViewWrapper } from "@/app/game/x/components/GameViewWrapper";

export function BjUI({
  onQuit,
  onGameOver,
}: {
  onQuit: () => void;
  onGameOver: (score: number, multiplier: number) => void;
}) {
  const { hand, total, status, drawCard, stand, resetGame, isProcessing } =
    useBjStore();
  const { streak } = useGlobalStore();

  useEffect(() => {
    if (status === "win") {
      const multiplier = total === 21 ? 3.0 : 2.0;
      onGameOver(total, multiplier);
    } else if (status === "loss") {
      onGameOver(0, 0);
    }
  }, [status, total, onGameOver]);

  return (
    <GameViewWrapper
      gameTitle="Blackjack 21"
      description="Select a chip to deal the cards"
      themeColor="orange"
      onQuit={onQuit}
      onGameStart={resetGame}
    >
      <div className="flex-1 w-full flex flex-col items-center justify-center p-4 relative pointer-events-auto">
        <div className="mb-6 text-center">
          <span
            className={`text-7xl sm:text-9xl font-black drop-shadow-lg transition-all duration-500 ${
              // ★ 修正：italic と scale-110 を削除。色だけを変更するようにしました。
              total > 21 || status === "loss"
                ? "text-red-600"
                : status === "win"
                  ? "text-yellow-400"
                  : "text-white"
            }`}
          >
            {total}
          </span>
          <p className="text-[10px] font-black tracking-[0.4em] opacity-40 uppercase mt-2 text-white">
            {total > 21
              ? "Busted"
              : status === "loss"
                ? "You Lost"
                : status === "win"
                  ? "Winner!"
                  : "Current Hand Value"}
          </p>
        </div>

        <div className="relative flex justify-center items-center h-[35vh] w-full max-w-lg">
          {hand.length > 0 ? (
            <div className="flex justify-center items-center">
              {hand.map((card, i) => (
                <div
                  key={i}
                  className="h-44 sm:h-56 aspect-[2/3] transition-all duration-500 ease-out"
                  style={{
                    marginLeft: i === 0 ? "0" : "-4rem",
                    zIndex: i,
                    transform: `rotate(${(i - (hand.length - 1) / 2) * 5}deg) translateY(${Math.abs(i - (hand.length - 1) / 2) * 4}px)`,
                  }}
                >
                  <PlayingCard rank={card.num} suit={card.suit} />
                </div>
              ))}
            </div>
          ) : (
            <div className="h-44 sm:h-56 aspect-[2/3] border-4 border-dashed border-white/5 rounded-2xl flex items-center justify-center text-white/5 text-4xl font-black uppercase tracking-widest">
              Ready
            </div>
          )}
        </div>
      </div>

      <div className="w-full max-w-md flex gap-4 shrink-0 pb-8 px-6 pointer-events-auto min-h-25 justify-center items-center">
        {status === "playing" && !isProcessing && (
          <>
            <GameButton onClick={drawCard} variant="primary">
              HIT
            </GameButton>
            <GameButton
              onClick={stand}
              variant="secondary"
              disabled={total === 0}
            >
              STAND
            </GameButton>
          </>
        )}
      </div>
    </GameViewWrapper>
  );
}
