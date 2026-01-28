"use client";
import { useEffect, useRef, useState } from "react";
import { GameLogic } from "@/hooks/gamehockeyLogic";

export default function GameScreen() {
  const logicRef = useRef<GameLogic | null>(null);
  const [, setTick] = useState(0);

  // 初期化
  useEffect(() => {
    logicRef.current = new GameLogic(800, 450, 4, 1.0);

    let frame: number;
    const loop = () => {
      logicRef.current?.update();
      setTick((t) => t + 1); // 再描画
      frame = requestAnimationFrame(loop);
    };
    loop();

    return () => cancelAnimationFrame(frame);
  }, []);

  const logic = logicRef.current;

  // --- PC: マウス移動 ---
  const handleMove = (e: React.MouseEvent) => {
    if (!logic) return;
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const y = e.clientY - rect.top;
    logic.movePlayer(y);
  };

  // --- スマホ: タッチ移動 ---
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!logic) return;
    const touch = e.touches[0];
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const y = touch.clientY - rect.top;
    logic.movePlayer(y);
  };

  // --- スーパーショット（PC: クリック / スマホ: タップ） ---
  const handleDown = () => {
    logic?.superShot();
  };

  return (
    <main className="h-screen bg-[#080812] flex flex-col">
      {/* Score Bar */}
      <div className="relative h-14 flex items-center justify-center text-white">
        <div className="absolute left-4 text-sm">
          {logic?.superReady ? "SUPER READY!" : `POWER: ${logic?.playerHits}/5`}
        </div>
        <div className="text-2xl text-cyan-300">
          {logic?.playerScore} - {logic?.enemyScore}
        </div>
      </div>

      {/* Game Area */}
      <div
        className="relative flex-1 bg-[#080812] border-y border-cyan-500/20"
        onMouseMove={handleMove}
        onMouseDown={handleDown}
        onTouchMove={handleTouchMove}
        onTouchStart={handleDown}
      >
        {/* Center Line */}
        <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-cyan-400/40 -translate-x-1/2"></div>

        {/* Left Goal Line */}
        <div className="absolute top-0 bottom-0 left-5 w-1 bg-pink-400/70"></div>

        {/* Right Goal Line */}
        <div className="absolute top-0 bottom-0 right-5 w-1 bg-green-300/70"></div>

        {/* Player Paddle */}
        {logic && (
          <div
            className="absolute w-[18px] h-[80px] bg-cyan-300 rounded-xl"
            style={{
              left: "40px",
              top: logic.player.y,
            }}
          />
        )}

        {/* Enemy Paddle */}
        {logic && (
          <div
            className="absolute w-[18px] h-[80px] bg-cyan-300 rounded-xl"
            style={{
              right: "40px",
              top: logic.enemy.y,
            }}
          />
        )}

        {/* Puck */}
        {logic && (
          <div
            className="absolute w-[26px] h-[26px] rounded-full bg-teal-300 shadow-[0_0_20px_5px_rgba(0,255,200,0.5)]"
            style={{
              left: logic.puck.x,
              top: logic.puck.y,
            }}
          />
        )}
      </div>

      {/* Bottom Bar */}
      <div className="h-10"></div>
    </main>
  );
}
