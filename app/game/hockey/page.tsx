"use client";

import { useHockeyGame } from "@/app/game/hockey/logic/useHockeyGame";
import { ScoreHeader } from "@/components/hockey/ScoreHeader";
import { StartButton } from "@/components/hockey/StartButton";
import { ResetButton } from "@/components/hockey/ResetButton";
import { GameField } from "@/components/hockey/GameField";

export default function HockeyPage() {
  const {
    started,
    showReset,
    logic,
    fieldRef,
    startGame,
    resetGame,
    handleMove,
    handleTouchMove,
  } = useHockeyGame();

  return (
    <main
      className={`
        w-full min-h-[100dvh] bg-[#080812]
        flex flex-col relative overflow-hidden touch-none
        pt-8 p-4 border-4 border-sky-300 rounded-2xl shadow-2xl
        ${started && !showReset ? "md:cursor-none" : "md:cursor-auto"}
      `}
    >
      {/* ★ 常に表示する */}
      <ScoreHeader
        score={logic?.reflectCount ?? 0}
        maxScore={logic?.maxReflectCount ?? 0}
      />

      {!started && <StartButton onStart={startGame} />}

      {showReset && <ResetButton onReset={resetGame} />}

      <GameField
        fieldRef={fieldRef}
        logic={logic}
        onMove={handleMove}
        onTouchMove={handleTouchMove}
      />

      <div className="h-10"></div>
    </main>
  );
}
