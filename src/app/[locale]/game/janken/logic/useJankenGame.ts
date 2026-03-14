"use client";

import { useState, useEffect } from "react";
import { incrementJankenWinAction } from "./actions";

const hands = ["✊", "✌️", "🖐️"];

export function useJankenGame() {
  const [skillPoints, setSkillPoints] = useState(60);
  const [playerWin, setPlayerWin] = useState(0);
  const [cpuWin, setCpuWin] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);

  const [resultText, setResultText] = useState("");
  const [resultState, setResultState] = useState<"none" | "win" | "lose">(
    "none",
  );

  const [endMessage, setEndMessage] = useState("");
  const [showClear, setShowClear] = useState(false);

  const [winner, setWinner] = useState<"player" | "cpu" | "draw" | null>(null);

  const judge = (p: string, c: string) => {
    if (p === c) return "draw";
    if (
      (p === "✊" && c === "✌️") ||
      (p === "✌️" && c === "🖐️") ||
      (p === "🖐️" && c === "✊")
    )
      return "player";
    return "cpu";
  };

  const play = (player: string) => {
    if (resultState !== "none") return;

    const cpu = hands[Math.floor(Math.random() * 3)];
    const result = judge(player, cpu);

    setResultText(
      `${player} ${
        result === "player" ? "勝ち" : result === "cpu" ? "負け" : "あいこ"
      } ${cpu}`,
    );
    setWinner(result);

    setSkillPoints((prev) => prev + 1);

    return result;
  };

  const useSkill = () => {
    if (resultState !== "none") return;

    if (skillPoints < 5) {
      setResultText("スキルポイントが足りません！");
      return "error";
    }

    setSkillPoints((prev) => prev - 5);

    setResultText(`必殺技!! 勝ち！`);
    setWinner("player");

    return "player";
  };

  // ★ 勝敗カウント更新（演出後に UI 側から呼ぶ）
  const applyResult = () => {
    if (winner === "player") setPlayerWin((prev) => prev + 1);
    if (winner === "cpu") setCpuWin((prev) => prev + 1);
  };

  useEffect(() => {
    if (currentStage === 4) {
      setEndMessage("🎉 優勝おめでとう！ 🎉");
      setResultState("win");
      setShowClear(true);

      // ★ 修正：fetch をやめて Server Action を呼ぶ
      const saveWinCount = async () => {
        try {
          await incrementJankenWinAction(); // 数値を渡す必要はありません（アクション側で+1します）
          console.log("Win count incremented!");
        } catch (e) {
          console.error("優勝回数の保存に失敗しました", e);
        }
      };

      saveWinCount();
    }
  }, [currentStage]);
  useEffect(() => {
    if (cpuWin === 3) {
      setEndMessage("残念…負けてしまった…");
      setResultState("lose");
      setShowClear(false);
    }
  }, [cpuWin]);

  // ★ ステージ進行は UI 側でやる（ここではやらない）

  const resetAll = () => {
    setSkillPoints(0);
    setPlayerWin(0);
    setCpuWin(0);
    setCurrentStage(0);
    setResultText("");
    setEndMessage("");
    setResultState("none");
    setShowClear(false);
  };

  return {
    skillPoints,
    playerWin,
    cpuWin,
    currentStage,
    resultText,
    resultState,
    endMessage,
    showClear,
    winner,
    play,
    useSkill,
    applyResult,
    setCurrentStage,
    setPlayerWin,
    setCpuWin,
    resetAll,
  };
}
