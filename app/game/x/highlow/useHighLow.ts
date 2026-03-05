// app/game/x/highlow/useHighLow.ts
import { useState, useCallback } from "react";

export function useHighLow() {
  const [score, setScore] = useState(0);
  const [currentNum, setCurrentNum] = useState(
    () => Math.floor(Math.random() * 13) + 1,
  );
  const [gameMsg, setGameMsg] = useState("HIGH か LOW か選んでね！");
  const [isProcessing, setIsProcessing] = useState(false);

  const resetGame = useCallback(() => {
    setScore(0);
    setCurrentNum(Math.floor(Math.random() * 13) + 1);
    setGameMsg("HIGH か LOW か選んでね！");
    setIsProcessing(false);
  }, []);

  const handleGuess = useCallback(
    (type: "high" | "low") => {
      if (isProcessing) return;
      setIsProcessing(true);

      const nextNum = Math.floor(Math.random() * 13) + 1;
      const isWin =
        type === "high" ? nextNum >= currentNum : nextNum <= currentNum;

      if (isWin) {
        setScore((s) => s + 1);
        setCurrentNum(nextNum);
        setGameMsg("正解！お見事！");
        window.dispatchEvent(
          new CustomEvent("game-visual-effect", { detail: { type: "win" } }),
        );
        window.dispatchEvent(new CustomEvent("game-next"));
        setTimeout(() => {
          setGameMsg("次は HIGH か LOW か？");
          setIsProcessing(false);
        }, 600);
      } else {
        setGameMsg(`残念！正解は ${nextNum} でした`);
        window.dispatchEvent(
          new CustomEvent("game-visual-effect", { detail: { type: "lose" } }),
        );
        window.dispatchEvent(new CustomEvent("game-over"));
        setTimeout(() => {
          resetGame();
          window.dispatchEvent(new CustomEvent("game-next"));
        }, 2000);
      }
    },
    [currentNum, isProcessing, resetGame],
  );

  return { score, currentNum, gameMsg, isProcessing, handleGuess, resetGame };
}
