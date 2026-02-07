"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import BracketUI from "./BracketUI";
import { ClearAnimation } from "@/components/animation/ClearAnimation";

const hands = ["✊", "✌️", "🖐️"];

export default function JankenPage() {
  const router = useRouter();

  // ★ battleCount は不要なので削除
  const [skillPoints, setSkillPoints] = useState(0); // スキルポイント

  const useSkill = () => {
    if (showBracketModal || resultState !== "none") return;

    if (skillPoints < 5) {
      setResultText("スキルポイントが足りません！");
      return;
    }

    // ★ 5ポイント消費
    setSkillPoints((prev) => prev - 5);

    // ★ 毎回違うテキストにする（これが重要）
    setResultText(`必殺技!! 勝ち！_${Date.now()}`);
    setScrambled("必殺技!! 勝ち！");
    // ★ 勝ち扱い
    setWinner("player");
  };

  const [playerWin, setPlayerWin] = useState(0);
  const [cpuWin, setCpuWin] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);

  const [resultText, setResultText] = useState("");
  const [scrambled, setScrambled] = useState("");

  const [showBracketModal, setShowBracketModal] = useState(false);

  const [resultState, setResultState] = useState<"none" | "win" | "lose">(
    "none",
  );

  const [endMessage, setEndMessage] = useState("");

  const bgmRef = useRef<HTMLAudioElement | null>(null);

  const [showClear, setShowClear] = useState(false);
  const stageLabels = ["初戦", "準決", "決勝", "🙌"];
  const stageBackgrounds = [
    "from-blue-900 to-black",
    "from-purple-900 to-black",
    "from-red-900 to-black",
    "from-yellow-600 to-black",
  ];

  const [isAnimating, setIsAnimating] = useState(false);

  const [winner, setWinner] = useState<"player" | "cpu" | "draw" | null>(null);

  const playBGM = () => {
    if (!bgmRef.current) {
      const bgm = new Audio("/sounds/click/clickbgm.mp3");
      bgm.loop = true;
      bgm.volume = 0.5;
      bgmRef.current = bgm;
    }

    bgmRef.current.currentTime = 0;
    bgmRef.current.play().catch(() => {});
  };

  useEffect(() => {
    playBGM();

    return () => {
      if (bgmRef.current) {
        bgmRef.current.pause();
      }
    };
  }, []);

  useEffect(() => {
    if (resultState !== "none") {
      if (bgmRef.current) {
        bgmRef.current.pause();
        bgmRef.current.currentTime = 0;
      }
    }
  }, [resultState]);

  useEffect(() => {
    if (resultState === "lose") {
      new Audio("/sounds/lose.mp3").play();
    }
  }, [resultState]);

  const judge = (p: string, c: string) => {
    if (p === c) return "あいこ";
    if (
      (p === "✊" && c === "✌️") ||
      (p === "✌️" && c === "🖐️") ||
      (p === "🖐️" && c === "✊")
    )
      return "勝ち";
    return "負け";
  };

  const play = (player: string) => {
    if (showBracketModal || resultState !== "none") return;

    const cpu = hands[Math.floor(Math.random() * 3)];
    const result = judge(player, cpu);

    setResultText(`${player} ${result} ${cpu}`);

    if (result === "勝ち") setWinner("player");
    else if (result === "負け") setWinner("cpu");
    else setWinner("draw");

    // ★ じゃんけん1回ごとにスキルポイント +1
    setSkillPoints((prev) => prev + 1);
  };

  useEffect(() => {
    if (!resultText) return;

    setIsAnimating(true);

    setScrambled("じゃん…");

    const t1 = setTimeout(() => {
      const kenSE = new Audio("/sounds/janken/pon.mp3");
      kenSE.volume = 1.0;
      kenSE.play();
      setScrambled("けん…");
    }, 500);

    const t2 = setTimeout(() => {
      const ponSE = new Audio("/sounds/janken/pon.mp3");
      ponSE.volume = 1.0;
      ponSE.play();
      setScrambled(resultText);

      if (winner === "player") setPlayerWin((prev) => prev + 1);
      if (winner === "cpu") setCpuWin((prev) => prev + 1);

      setIsAnimating(false);
    }, 1000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [resultText]);

  useEffect(() => {
    if (isAnimating) return;

    if (playerWin === 3) {
      setShowBracketModal(true);
      setCurrentStage((prev) => prev + 1);

      setTimeout(() => {
        setShowBracketModal(false);
        resetForNextMatch();
      }, 1800);
    }
  }, [playerWin, isAnimating]);

  useEffect(() => {
    if (isAnimating) return;

    if (currentStage === 3) {
      setTimeout(() => {
        setShowClear(true);

        setEndMessage("🎉 優勝おめでとう！ 🎉");
        setResultState("win");

        const audio = new Audio("/sounds/win.mp3");
        audio.volume = 0.8;
        audio.play();
      }, 2000);
    }
  }, [currentStage, isAnimating]);

  useEffect(() => {
    if (isAnimating) return;

    if (cpuWin === 3) {
      setEndMessage("CPUの勝ち…");
      setResultState("lose");
    }
  }, [cpuWin, isAnimating]);

  const resetForNextMatch = () => {
    setPlayerWin(0);
    setCpuWin(0);
    setResultText("");
  };

  const resetAll = () => {
    setPlayerWin(0);
    setCpuWin(0);
    setCurrentStage(0);
    setResultText("");
    setEndMessage("");
    setResultState("none");
    playBGM();
  };

  return (
    <div className="relative">
      <BracketUI show={showBracketModal} currentStage={currentStage} />

      <main
        className={`w-full min-h-[100dvh] p-6 border-4 border-pink-300 rounded-2xl 
  bg-gradient-to-b ${stageBackgrounds[currentStage]} 
  text-white font-mono pt-[32px]
  flex flex-col justify-center items-center
  ${resultState !== "none" ? "pointer-events-none" : ""}`}
      >
        <div className="text-center mb-4 text-lg font-bold">
          <p className="text-3xl mb-2 ">🤛{stageLabels[currentStage]}🤜</p>

          <div className="flex justify-between px-2">
            <div className="flex">
              <span className="text-xl">あなた:</span>
              {[0, 1, 2].map((i) => (
                <span key={i} className="text-yellow-300 text-2xl">
                  {i < playerWin ? "★" : "☆"}
                </span>
              ))}
            </div>

            <div className="flex">
              <span className="text-xl">CPU:</span>
              {[0, 1, 2].map((i) => (
                <span key={i} className="text-yellow-300 text-2xl">
                  {i < cpuWin ? "★" : "☆"}
                </span>
              ))}
            </div>
          </div>

          <p className="text-center text-xl  h-8 flex items-center justify-center">
            {scrambled.replace(/_.+$/, "")}{" "}
          </p>

          <div className="flex gap-5 justify-center mt-4">
            {hands.map((h) => (
              <button
                key={h}
                disabled={isAnimating}
                onClick={() => {
                  new Audio("/sounds/janken/pon.mp3").play();
                  play(h);
                }}
                className={`text-6xl p-3 rounded-full border-2 transition
    ${
      isAnimating
        ? "bg-gray-600 border-gray-400 opacity-50 cursor-not-allowed"
        : "bg-gray-800 border-pink-500 hover:scale-125"
    }
  `}
              >
                {h}
              </button>
            ))}
          </div>

          <div className="flex justify-center items-center gap-10 mt-4">
            <button
              onClick={() => {
                new Audio("/sounds/janken/vvv.mp3").play(); // ★ ここで音を鳴らす
                useSkill();
              }}
              disabled={skillPoints < 5 || isAnimating}
              className={`px-6 py-3 rounded-xl font-bold border-4 transition
    ${
      skillPoints < 5 || isAnimating
        ? "bg-gray-400 border-gray-500 text-gray-700"
        : "bg-yellow-300 border-yellow-500 text-black hover:scale-105"
    }
  `}
            >
              必殺技<p>スキルポイント: {skillPoints}</p>
            </button>
          </div>
        </div>
      </main>

      {resultState !== "none" && (
        <div className="absolute inset-0 min-h-[100dvh] pointer-events-auto">
          <div className="absolute inset-0 backdrop-blur-md bg-black/30"></div>

          <div className="relative z-10 flex flex-col items-center justify-center min-h-[100dvh] gap-6">
            {resultState === "win" && showClear && <ClearAnimation />}

            <p className="text-3xl font-bold text-white drop-shadow mb-4">
              {endMessage}
            </p>

            <div className="flex flex-row gap-6">
              {resultState === "win" && (
                <button
                  onClick={() => router.push("/")}
                  className="px-7 py-3 bg-green-400 rounded-xl font-bold hover:scale-105 transition"
                >
                  ホーム
                </button>
              )}

              {resultState === "lose" && (
                <button
                  onClick={resetAll}
                  className="px-6 py-3 bg-pink-300 rounded-xl font-bold text-black hover:scale-105 transition"
                >
                  リセット
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
