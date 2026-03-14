"use client";

import { useState, useEffect, useRef } from "react"; // useRef を追加
import { useRouter } from "next/navigation";
import BracketUI from "@/app/[locale]/game/janken/components/BracketUI";
import { BgmController } from "@/app/[locale]/game/click/components/BgmController";
import { StageHeader } from "@/app/[locale]/game/janken/components/StageHeader";
import { WinStars } from "@/app/[locale]/game/janken/components/WinStars";
import { ResultOverlay } from "@/app/[locale]/game/janken/components/ResultOverlay";
import { JankenButtons } from "@/app/[locale]/game/janken/components/JankenButtons";
import { SkillButton } from "@/app/[locale]/game/janken/components/SkillButton";
import { JankenAnimation } from "@/app/[locale]/game/janken/components/JankenAnimation";
import { useJankenGame } from "@/app/[locale]/game/janken/logic/useJankenGame";
import { CountHeader } from "@/app/[locale]/game/janken/components/CountHeader";
// ★ 作成したアクションをインポート
import { getJankenTotalWinsAction } from "@/app/[locale]/game/janken/logic/actions"; 

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
  const fetchedRef = useRef(false); // 二重読み込み防止用

  // ★ 修正：fetch を Server Action に変更
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const fetchWinCount = async () => {
      try {
        const totalWins = await getJankenTotalWinsAction();
        setWinCount(totalWins);
      } catch (e) {
        console.error("優勝回数の取得に失敗しました", e);
      }
    };

    fetchWinCount();
  }, []);

  // --- 以降、表示ロジックは変更なし ---
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
  }, [playerWin, setCurrentStage, setPlayerWin, setCpuWin]);

  return (
    <div className="relative">
      <CountHeader winCount={winCount} currentStage={currentStage} />

      {resultState === "none" && (
        <BgmController src="/sounds/click/clickbgm.mp3" />
      )}

      <BracketUI show={showBracket} currentStage={currentStage} />

      <main
        className={`w-full min-h-[100dvh] p-6 border-4 border-pink-300 rounded-2xl 
          bg-gradient-to-b ${stageBackgrounds[currentStage]} 
          text-white font-mono pt-[32px]
          flex flex-col justify-center items-center
          ${resultState !== "none" ? "pointer-events-none" : ""}`}
      >
        <div className="text-center mb-4 text-lg font-bold">
          <StageHeader label={stageLabels[currentStage]} />

          <div className="flex justify-between px-2 w-full max-w-sm">
            <WinStars label="あなた" winCount={playerWin} />
            <WinStars label="CPU" winCount={cpuWin} />
          </div>

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

          <JankenButtons
            disabled={animating || resultState !== "none"}
            onPlay={handlePlay}
          />

          <div className="flex justify-center items-center gap-10 mt-4">
            <SkillButton
              disabled={skillPoints < 5 || animating}
              skillPoints={skillPoints}
              onUseSkill={handleSkill}
            />
          </div>
        </div>
      </main>

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