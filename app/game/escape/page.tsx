"use client";

import { useEscapeGame } from "@/app/game/escape/logic/useEscapeGame";
import { ScoreHeader } from "@/app/game/escape/components/ScoreHeader";
import { StartButton } from "@/app/game/escape/components/StartButton";
import { ResetButton } from "@/app/game/hockey/components/ResetButton";
import { Joystick } from "@/app/game/escape/components/Joystick";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

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
    backGame, // ← ★ これを受け取る
  } = useEscapeGame();

  const router = useRouter();

  // ★ BACK ボタンの処理
  const handleBack = () => {
    backGame(); // ← スコア保存
    router.back(); // ← 前のページへ戻る
  };

  // --- DBから取得したハイスコア ---
  const [dbMaxScore, setDbMaxScore] = useState(0);

  // --- 初回だけハイスコア取得 ---
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const fetchHighScore = async () => {
      try {
        const res = await fetch("/api/highscore?game=escape");
        if (res.ok) {
          const data = await res.json();
          if (data && data.value) {
            setDbMaxScore(data.value);
          }
        }
      } catch (e) {
        console.error("ハイスコアの取得に失敗しました", e);
      }
    };

    fetchHighScore();
  }, []);

  const displayMaxScore = Math.max(dbMaxScore, maxScore);

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
      <ScoreHeader score={score} maxScore={displayMaxScore} />

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
          onBack={handleBack} // ← ★ BACK ボタンを追加
        />
      )}

      <Joystick onMove={handleStickMove} onEnd={handleStickEnd} />
    </div>
  );
}
