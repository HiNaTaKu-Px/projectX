"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import TournamentBracket from "./components/TournamentBracket";

const hands = ["✊", "✌️", "🖐️"];
const cpuNames = ["CPU-A", "CPU-C", "CPU-F"];
const roundNames = ["一回戦", "二回戦", "決勝戦"];

export default function JankenPage() {
  <main className="relative min-h-screen overflow-hidden text-gray-800"></main>;
  const bgmRef = useRef<HTMLAudioElement | null>(null);

  const [playerWin, setPlayerWin] = useState(0);
  const [cpuWin, setCpuWin] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [resultText, setResultText] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [tournamentWin, setTournamentWin] = useState(false);
  const [skillUsed, setSkillUsed] = useState(false);

  const startBgm = () => {
    if (!bgmRef.current) {
      bgmRef.current = playJankenBgm();
    }
  };

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
    const cpu = hands[Math.floor(Math.random() * 3)];
    const result = judge(player, cpu);
    setResultText(`${player} ${result} ${cpu}`);

    if (result === "勝ち") {
      const next = playerWin + 1;
      setPlayerWin(next);
      if (next >= 3) {
        const nextStage = currentStage + 1;
        if (nextStage >= 3) {
          setTournamentWin(true);
          setGameOver(true);
        } else {
          setCurrentStage(nextStage);
          setPlayerWin(0);
          setCpuWin(0);
        }
      }
    } else if (result === "負け") {
      const next = cpuWin + 1;
      setCpuWin(next);
      if (next >= 3) {
        setGameOver(true);
      }
    }
  };

  const useSkill = () => {
    if (skillUsed || gameOver) return;
    setSkillUsed(true);
    setResultText("必殺技!! 勝ち！");
    setPlayerWin((prev) => {
      const next = prev + 1;
      if (next >= 3) {
        const nextStage = currentStage + 1;
        if (nextStage >= 3) {
          setTournamentWin(true);
          setGameOver(true);
        } else {
          setCurrentStage(nextStage);
          setPlayerWin(0);
          setCpuWin(0);
        }
      }
      return next;
    });
  };

  const reset = () => {
    setPlayerWin(0);
    setCpuWin(0);
    setCurrentStage(0);
    setResultText("");
    setGameOver(false);
    setTournamentWin(false);
    setSkillUsed(false);
  };

  return (
    <main className="min-h-screen bg-linear-to-b from-blue-100 to-blue-200 text-center p-6">
      <h1 className="text-3xl font-bold mb-4">じゃんけんトーナメント</h1>

      {!gameOver && (
        <>
          <p className="text-lg mb-2">
            {roundNames[currentStage]}：{cpuNames[currentStage]}
          </p>
          <div className="flex justify-center gap-4 mb-4">
            {hands.map((hand) => (
              <button
                key={hand}
                onClick={() => play(hand)}
                className="text-4xl px-4 py-2 bg-white rounded shadow hover:scale-110 transition"
              >
                {hand}
              </button>
            ))}
          </div>
          <p className="text-xl font-bold text-blue-800">{resultText}</p>
          <div className="mt-4 text-sm text-gray-700">
            <p>
              あなた：{"★".repeat(playerWin)}
              {"☆".repeat(3 - playerWin)}
            </p>
            <p>
              CPU：{"★".repeat(cpuWin)}
              {"☆".repeat(3 - cpuWin)}
            </p>
          </div>

          <button
            onClick={useSkill}
            className={`mt-6 px-6 py-2 rounded shadow text-white font-bold transition ${
              skillUsed
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-yellow-500 hover:scale-105"
            }`}
          >
            必殺技
          </button>
        </>
      )}

      {tournamentWin && (
        <motion.div
          initial={{ scale: 0, y: 100 }}
          animate={{ scale: 1.2, y: 0 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="text-3xl font-bold text-yellow-500 mt-6"
        >
          🏆 優勝！おめでとう！
        </motion.div>
      )}

      {gameOver && (
        <div className="mt-8">
          <p className="text-2xl font-bold mb-4">
            {tournamentWin ? "優勝！おめでとう！" : "敗退… また挑戦しよう！"}
          </p>
          <button
            onClick={reset}
            className="px-6 py-2 bg-red-500 text-white rounded shadow hover:scale-105 transition"
          >
            リセット
          </button>
        </div>
      )}

      <TournamentBracket currentStage={currentStage} />
    </main>
  );
}
function playJankenBgm(): HTMLAudioElement | null {
  throw new Error("Function not implemented.");
}
