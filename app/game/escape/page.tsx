"use client";

import { useEscapeGame } from "@/lib/game/escape/useEscapeGame";
import { ScoreHeader } from "@/components/escape/ScoreHeader";
import { StartButton } from "@/components/escape/StartButton";
import { ResetButton } from "@/components/escape/ResetButton";
import { Joystick } from "@/components/escape/Joystick";
import { useEffect } from "react";

export default function EscapePage() {
  const {
    canvasRef,
    running,
    setRunning,
    score,
    maxScore,
    gameOver,
    reset,
    saveMaxScore,
    handleStickMove,
    handleStickEnd,
  } = useEscapeGame();

  // ★★★★★ ゲームオーバー時に自動で保存する ★★★★★
  useEffect(() => {
    if (gameOver) {
      saveMaxScore();
    }
  }, [gameOver]);

  return (
    <div
      className={`
    w-full h-[100dvh] bg-[#080812]
    flex flex-col relative overflow-hidden touch-none overscroll-none
    pt-8 p-4
    border-4 border-violet-300 rounded-2xl shadow-2xl
    ${running && !gameOver ? "md:cursor-none" : "md:cursor-auto"}
  `}
    >
      <ScoreHeader score={score} maxScore={maxScore} />

      {!running && (
        <StartButton
          onStart={() => {
            const canvas = canvasRef.current;
            if (canvas) reset(canvas.width, canvas.height);
            setRunning(true);
          }}
        />
      )}

      <canvas ref={canvasRef} className="touch-none flex-1" />

      {gameOver && (
        <ResetButton
          onReset={() => {
            const canvas = canvasRef.current;
            if (canvas) reset(canvas.width, canvas.height);
          }}
        />
      )}

      <Joystick onMove={handleStickMove} onEnd={handleStickEnd} />
    </div>
  );
}
