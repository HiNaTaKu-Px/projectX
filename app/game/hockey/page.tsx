"use client";

import { useEffect, useState } from "react";
import { useHockeyGame } from "@/app/game/hockey/logic/useHockeyGame";
import { ScoreHeader } from "@/app/game/hockey/components/ScoreHeader";
import { StartButton } from "@/app/game/hockey/components/StartButton";
import { ResetButton } from "@/app/game/hockey/components/ResetButton";
import { GameField } from "@/app/game/hockey/components/GameField";
import { useRouter } from "next/navigation";

export default function HockeyPage() {
  const router = useRouter();

  const {
    started,
    showReset,
    resultState, // ★ ロジックから勝敗ステートを取得
    logic,
    fieldRef,
    startGame,
    resetGame,
    backGame,
    handleMove,
    handleTouchMove,
  } = useHockeyGame();

  const handleBack = () => {
    backGame(); // スコア保存
    router.back(); // 前のページに戻る
  };

  const [dbMaxScore, setDbMaxScore] = useState(0);

  // ハイスコアの初期取得
  useEffect(() => {
    const fetchHighScore = async () => {
      try {
        const res = await fetch("/api/highscore?game=hockey");
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

  // DBのスコアと現在のセッションの最高スコアのうち、高い方を表示
  const displayMaxScore = Math.max(dbMaxScore, logic?.maxReflectCount ?? 0);

  return (
    <main
      className={`
        w-full min-h-[100dvh] bg-[#080812]
        flex flex-col relative overflow-hidden touch-none
        pt-8 p-4 border-4 border-sky-300 rounded-2xl shadow-2xl
        ${started && !showReset ? "md:cursor-none" : "md:cursor-auto"}
      `}
    >
      {/* スコア表示ヘッダー */}
      <ScoreHeader
        score={logic?.reflectCount ?? 0}
        maxScore={displayMaxScore}
      />

      {/* ゲーム開始前：スタートボタン */}
      {!started && <StartButton onStart={startGame} />}

      {/* ゲームオーバー時：アバター付きリセットボタン（勝敗を渡す） */}
      {showReset && (
        <ResetButton
          onReset={resetGame}
          onBack={handleBack}
          resultState={resultState} // ★ ここで win / lose を渡す
        />
      )}

      {/* ゲームフィールド本体 */}
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
