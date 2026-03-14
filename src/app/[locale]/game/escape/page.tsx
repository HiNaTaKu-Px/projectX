"use client";

import { useEscapeGame } from "@/app/[locale]/game/escape/logic/useEscapeGame";
import { ScoreHeader } from "@/app/[locale]/game/escape/components/ScoreHeader";
import { StartButton } from "@/app/[locale]/game/escape/components/StartButton";
import { ResetButton } from "@/app/[locale]/game/hockey/components/ResetButton";
import { Joystick } from "@/app/[locale]/game/escape/components/Joystick";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { getScoreAction } from "@/app/[locale]/game/escape/logic/actions"; // パス調整

export default function EscapePage() {
  const {
    canvasRef,
    running,
    setRunning,
    score,
    maxScore,
    gameOver,
    reset,
    handleStickMove,
    handleStickEnd,
    backGame,
  } = useEscapeGame();

  const router = useRouter();
  const [dbMaxScore, setDbMaxScore] = useState(0);
  const fetchedRef = useRef(false);

  // BACK ボタンの処理
  const handleBack = async () => {
    await backGame(); // スコア保存完了を待機
    router.back();
  };

  // ★ サーバーアクションでハイスコア取得 (fetchを削除)
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    getScoreAction().then((val) => {
      setDbMaxScore(val);
    });
  }, []);

  const displayMaxScore = Math.max(dbMaxScore, maxScore, score);

  return (
    <div className={`w-full min-h-dvh bg-[#080812] flex flex-col relative overflow-hidden touch-none overscroll-none pt-8 p-4 border-4 border-violet-300 rounded-2xl shadow-2xl ${running && !gameOver ? "md:cursor-none" : "md:cursor-auto"}`}>
      <ScoreHeader score={score} maxScore={displayMaxScore} />

      {!running && (
        <StartButton onStart={() => {
          const canvas = canvasRef.current;
          if (canvas) reset(canvas.width, canvas.height);
          setRunning(true);
        }} />
      )}

      <canvas ref={canvasRef} className="touch-none flex-1" />

      {gameOver && (
        <ResetButton
          onReset={() => {
            const canvas = canvasRef.current;
            if (canvas) reset(canvas.width, canvas.height);
          }}
          onBack={handleBack}
          resultState={score >= 50 ? "win" : "lose"}
        />
      )}

      <Joystick onMove={handleStickMove} onEnd={handleStickEnd} />
    </div>
  );
}