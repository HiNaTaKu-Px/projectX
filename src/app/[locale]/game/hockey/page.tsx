"use client";

import { useEffect, useState, useRef } from "react";
import { useHockeyGame } from "@/app/[locale]/game/hockey/logic/useHockeyGame";
import { ScoreHeader } from "@/app/[locale]/game/hockey/components/ScoreHeader";
import { StartButton } from "@/app/[locale]/game/hockey/components/StartButton";
import { ResetButton } from "@/app/[locale]/game/hockey/components/ResetButton";
import { GameField } from "@/app/[locale]/game/hockey/components/GameField";
import { useRouter } from "next/navigation";
import { gethockeyScoreAction } from "./logic/actions";

export default function HockeyPage() {
  const router = useRouter();
  const [dbMaxScore, setDbMaxScore] = useState(0);
  const fetchedRef = useRef(false);

  const {
    started,
    showReset,
    resultState,
    logic,
    fieldRef,
    startGame,
    resetGame,
    backGame,
    handleMove,
    handleTouchMove,
  } = useHockeyGame();

  const handleBack = async () => {
    await backGame();
    router.back();
  };

  // サーバーアクションでハイスコア取得 (404エラー対策)
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const fetchScore = async () => {
      const val = await gethockeyScoreAction();
      setDbMaxScore(val);
    };
    fetchScore();
  }, []);

  const displayMaxScore = Math.max(dbMaxScore, logic?.maxReflectCount ?? 0);

  return (
    <main
      className={`
        w-full min-h-dvh bg-[#080812]
        flex flex-col relative overflow-hidden touch-none
        pt-8 p-4 border-4 border-sky-300 rounded-2xl shadow-2xl
        ${started && !showReset ? "md:cursor-none" : "md:cursor-auto"}
      `}
    >
      <ScoreHeader
        score={logic?.reflectCount ?? 0}
        maxScore={displayMaxScore}
      />

      {!started && <StartButton onStart={startGame} />}

      {/* showReset と resultState 両方があるときのみ表示 (型エラー対策) */}
      {showReset && resultState && (
        <ResetButton
          onReset={resetGame}
          onBack={handleBack}
          resultState={resultState}
        />
      )}

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