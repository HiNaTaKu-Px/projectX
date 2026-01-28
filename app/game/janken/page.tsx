"use client";

import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const hands = ["✊", "✌️", "🖐️"];

export default function JankenPage() {
  const router = useRouter();

  const [playerWin, setPlayerWin] = useState(0);
  const [cpuWin, setCpuWin] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [resultText, setResultText] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [tournamentWin, setTournamentWin] = useState(false);
  const [skillUsed, setSkillUsed] = useState(false);
  const [isBlurred, setIsBlurred] = useState(false);
  const [endMessage, setEndMessage] = useState("");

  const bgmRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const bgm = new Audio("/sounds/click/clickbgm.mp3");
    bgm.loop = true;
    bgm.volume = 0.5;
    bgm.play().catch(() => {});
    bgmRef.current = bgm;

    return () => {
      if (bgmRef.current && !bgmRef.current.paused) {
        bgmRef.current.pause();
      }
    };
  }, []);

  // 勝敗がついたらモザイク
  useEffect(() => {
    if (playerWin === 3) {
      setResultText("あなたの勝ち！");
      setEndMessage("🎉 やったね！勝利！");
      setIsBlurred(true);
    }
    if (cpuWin === 3) {
      setResultText("CPUの勝ち…");
      setEndMessage("😢 ざんねん…また挑戦してね");
      setIsBlurred(true);
    }
  }, [playerWin, cpuWin]);

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
    if (gameOver || isBlurred) return;

    const cpu = hands[Math.floor(Math.random() * 3)];
    const result = judge(player, cpu);
    setResultText(`${player} ${result} ${cpu}`);

    if (result === "勝ち") {
      setPlayerWin((prev) => prev + 1);
    } else if (result === "負け") {
      setCpuWin((prev) => prev + 1);
    }
  };

  const useSkill = () => {
    if (skillUsed || gameOver || isBlurred) return;

    setSkillUsed(true);
    setResultText("必殺技!! 勝ち！");
    setPlayerWin((prev) => prev + 1);
  };

  const reset = () => {
    setPlayerWin(0);
    setCpuWin(0);
    setCurrentStage(0);
    setResultText("");
    setGameOver(false);
    setTournamentWin(false);
    setSkillUsed(false);
    setIsBlurred(false);
    setEndMessage(""); // ← これでOK
  };

  return (
    <div className="relative">
      {/* ゲーム画面（blur対象） */}
      <main
        className={`mt-4 w-full max-w-none p-6 sm:p-10 border-4 border-yellow-400 rounded-2xl shadow-2xl bg-gradient-to-b from-blue-900 to-black text-white font-mono transition ${
          isBlurred ? "blur-sm" : ""
        }`}
      >
        <h1 className="text-3xl font-bold text-center mb-4 drop-shadow">
          じゃんけんゲーム
        </h1>
        <div className="text-center mb-4 text-lg font-bold">
          <p className="text-xl mb-4">一回戦: CPU-A</p>

          {/* ★ 左右に並べるコンテナ */}
          <div className="flex justify-between px-6">
            {/* あなた（左） */}
            <div className="flex items-center gap-2">
              <span className="text-xl">あなた:</span>
              {[0, 1, 2].map((i) => (
                <span key={i} className="text-yellow-300 text-2xl">
                  {i < playerWin ? "★" : "☆"}
                </span>
              ))}
            </div>

            {/* CPU（右） */}
            <div className="flex items-center gap-2">
              <span className="text-xl">CPU:</span>
              {[0, 1, 2].map((i) => (
                <span key={i} className="text-yellow-300 text-2xl">
                  {i < cpuWin ? "★" : "☆"}
                </span>
              ))}
            </div>
          </div>
          <p className="text-center text-xl mb-4 h-8 flex items-center justify-center">
            {resultText}
          </p>

          <div className="flex justify-center items-center gap-10 mt-6 mb-6 ml-[-140px]">
            <button
              onClick={useSkill}
              disabled={skillUsed}
              className=" px-6 py-3 rounded-xl font-bold border-4 
      bg-yellow-300 border-yellow-500 text-black hover:scale-105 transition"
            >
              必殺技
            </button>

            <div className="flex gap-10">
              {hands.map((h) => (
                <button
                  key={h}
                  onClick={() => play(h)}
                  className="
        text-5xl p-6 rounded-full transition transform hover:scale-125
        bg-black text-cyan-300 border-2 border-cyan-500
        shadow-[0_0_10px_#00eaff,0_0_20px_#00eaff,0_0_40px_#00eaff]
        hover:shadow-[0_0_15px_#00eaff,0_0_30px_#00eaff,0_0_60px_#00eaff]
      "
                >
                  {h}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* ★ モザイク中だけ表示される（blurの外） */}
      {isBlurred && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 pointer-events-auto">
          {/* 勝敗メッセージ（上に表示） */}
          <p className="text-3xl font-bold text-white drop-shadow mb-4">
            {endMessage}
          </p>

          {/* ボタンを横並びにする */}
          <div className="flex flex-row gap-6">
            <button
              onClick={() => router.push("/")}
              className="px-7 py-3 bg-green-400 rounded-xl font-bold hover:scale-105 transition"
            >
              ホーム
            </button>

            <button
              onClick={reset}
              className="px-6 py-3 bg-pink-300 rounded-xl font-bold text-black hover:scale-105 transition"
            >
              リセット
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
