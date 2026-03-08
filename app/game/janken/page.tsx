"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BracketUI from "@/app/game/janken/components/BracketUI";
import { BgmController } from "@/app/game/click/components/BgmController";
import { StageHeader } from "@/app/game/janken/components/StageHeader";
import { WinStars } from "@/app/game/janken/components/WinStars";
import { ResultOverlay } from "@/app/game/janken/components/ResultOverlay";
import { JankenButtons } from "@/app/game/janken/components/JankenButtons";
import { SkillButton } from "@/app/game/janken/components/SkillButton";
import { JankenAnimation } from "@/app/game/janken/components/JankenAnimation";
import { useJankenGame } from "./logic/useJankenGame";
import { CountHeader } from "@/app/game/janken/components/CountHeader";

export default function JankenPage() {
  const router = useRouter();

  const {
    skillPoints,
    playerWin,
    cpuWin,
    currentStage,
    resultText,
    resultState,
    endMessage,
    showClear,
    play,
    useSkill,
    applyResult,
    resetAll,
    setCurrentStage,
    setPlayerWin,
    setCpuWin,
  } = useJankenGame();

  const [animating, setAnimating] = useState(false);
  const [showBracket, setShowBracket] = useState(false);

  // ★ 優勝回数（累計）
  const [winCount, setWinCount] = useState(0);

  useEffect(() => {
    const fetchWinCount = async () => {
      try {
        const res = await fetch("/api/wincount?game=janken_wins");
        if (res.ok) {
          const data = await res.json();
          if (data && data.value !== undefined) {
            setWinCount(data.value);
          }
        }
      } catch (e) {
        console.error("優勝回数の取得に失敗しました", e);
      }
    };

    fetchWinCount();
  }, []);

  const stageLabels = ["初戦", "二回戦", "準決勝", "決勝"];
  const stageBackgrounds = [
    "from-blue-900 to-black",
    "from-purple-900 to-black",
    "from-red-900 to-black",
    "from-yellow-600 to-black",
  ];

  const handlePlay = (hand: string) => {
    const result = play(hand);
    if (!result) return;
    setAnimating(true);
  };

  const handleSkill = () => {
    const result = useSkill();
    if (result === "error") return;
    setAnimating(true);
  };

  useEffect(() => {
    if (playerWin === 3) {
      setShowBracket(true);
      setTimeout(() => {
        setCurrentStage((prev) => prev + 1);
        setPlayerWin(0);
        setCpuWin(0);
        setShowBracket(false);
      }, 1800);
    }
  }, [playerWin]);

  return (
    <div className="relative">
      {/* ★ 優勝回数ヘッダー */}
      <CountHeader winCount={winCount} currentStage={currentStage} />

      {resultState === "none" && (
        <BgmController src="/sounds/click/clickbgm.mp3" />
      )}

      {/* ★ ステージ演出 */}
      <BracketUI show={showBracket} currentStage={currentStage} />

      <main
        className={`w-full min-h-[100dvh] p-6 border-4 border-pink-300 rounded-2xl 
          bg-gradient-to-b ${stageBackgrounds[currentStage]} 
          text-white font-mono pt-[32px]
          flex flex-col justify-center items-center
          ${resultState !== "none" ? "pointer-events-none" : ""}`}
      >
        <div className="text-center mb-4 text-lg font-bold">
          {/* ステージ名 */}
          <StageHeader label={stageLabels[currentStage]} />

          {/* 勝敗スター */}
          <div className="flex justify-between px-2 w-full max-w-sm">
            <WinStars label="あなた" winCount={playerWin} />
            <WinStars label="CPU" winCount={cpuWin} />
          </div>

          {/* じゃんけん演出 or 結果テキスト */}
          {animating ? (
            <JankenAnimation
              trigger={animating}
              resultText={resultText}
              onFinish={() => {
                applyResult();
                setAnimating(false);
              }}
            />
          ) : (
            <p className="text-center text-xl h-8 flex items-center justify-center"></p>
          )}

          {/* ✊✌️🖐️ ボタン */}
          <JankenButtons
            disabled={animating || resultState !== "none"}
            onPlay={handlePlay}
          />

          {/* 必殺技 */}
          <div className="flex justify-center items-center gap-10 mt-4">
            <SkillButton
              disabled={skillPoints < 5 || animating}
              skillPoints={skillPoints}
              onUseSkill={handleSkill}
            />
          </div>
        </div>
      </main>

      {/* 勝敗画面 */}
      {resultState !== "none" && (
        <ResultOverlay
          resultState={resultState}
          showClear={showClear}
          endMessage={endMessage}
          onHome={() => router.push("/")}
          onReset={resetAll}
        />
      )}
    </div>
  );
}
