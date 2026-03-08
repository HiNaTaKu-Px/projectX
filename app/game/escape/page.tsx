"use client";

import { useEscapeGame } from "@/app/game/escape/logic/useEscapeGame";
import { ScoreHeader } from "@/app/game/escape/components/ScoreHeader";
import { StartButton } from "@/app/game/escape/components/StartButton";
import { ResetButton } from "@/app/game/hockey/components/ResetButton"; // 共有コンポーネント
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
    backGame,
  } = useEscapeGame();

  const router = useRouter();

  // BACK ボタンの処理
  const handleBack = () => {
    backGame(); // スコア保存
    router.back();
  };

  // DBから取得したハイスコア
  const [dbMaxScore, setDbMaxScore] = useState(0);

  // 初回だけハイスコア取得
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

  // 表示用のハイスコア計算
  // DB、セッション最高値、現在のスコアの3つから最大値を出すことで、
  // UI上のハイスコア表示が常に最新になります。
  const displayMaxScore = Math.max(dbMaxScore, maxScore, score);

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

      {/* --- リザルト画面（アバター対応） --- */}
      {gameOver && (
        <ResetButton
          onReset={() => {
            const canvas = canvasRef.current;
            if (canvas) reset(canvas.width, canvas.height);
          }}
          onBack={handleBack}
          // スコアが50以上なら win (笑顔)、未満なら lose (悲しみ)
          resultState={score >= 50 ? "win" : "lose"}
        />
      )}

      <Joystick onMove={handleStickMove} onEnd={handleStickEnd} />
    </div>
  );
}
