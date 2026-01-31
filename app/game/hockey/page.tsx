"use client";
import { useEffect, useRef, useState } from "react";
import { GameLogic } from "@/app/game/hockey/gamehockeyLogic";
import { useRouter } from "next/navigation";

export default function GameScreen() {
  const logicRef = useRef<GameLogic | null>(null);
  const [, setTick] = useState(0);
  const [isPortrait, setIsPortrait] = useState(false);
  const [started, setStarted] = useState(false);
  const [nextRound, setNextRound] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const check = () => setIsPortrait(window.innerHeight > window.innerWidth);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (!started) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // ★ ゲーム開始時に1回だけ生成
    if (!logicRef.current) {
      logicRef.current = new GameLogic(width, height, 4, 1.0, isPortrait, () =>
        setNextRound(true),
      );
    }

    let frame: number;
    const loop = () => {
      // ★ nextRound が true の間は update を止める
      if (!nextRound) {
        logicRef.current?.update();
        setTick((t) => t + 1);
      }
      frame = requestAnimationFrame(loop);
    };
    loop();

    return () => cancelAnimationFrame(frame);
  }, [started, nextRound]); // ★ nextRound を追加

  const logic = logicRef.current;

  const handleMove = (e: React.MouseEvent) => {
    if (!logic) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const pos = isPortrait ? e.clientX - rect.left : e.clientY - rect.top;
    logic.movePlayer(pos);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!logic) return;
    const touch = e.touches[0];
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const pos = isPortrait
      ? touch.clientX - rect.left
      : touch.clientY - rect.top;
    logic.movePlayer(pos);
  };

  const handleDown = () => logic?.superShot();

  return (
    <main className="h-screen bg-[#080812] flex flex-col relative overflow-hidden touch-none">
      {!started && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <button
            onClick={() => setStarted(true)}
            className="px-6 py-3 bg-cyan-400 text-black font-bold rounded-lg shadow-lg active:scale-95"
          >
            GAME START
          </button>
        </div>
      )}

      {nextRound && (
        <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
          <button
            onClick={() => {
              logic?.resetRound(false, null);
              setNextRound(false);
            }}
            className="px-6 py-3 bg-yellow-300 text-black font-bold rounded-lg shadow-lg active:scale-95 pointer-events-auto"
          >
            NEXT ROUND
          </button>
        </div>
      )}

      <div className="relative h-14 flex items-center justify-center text-white">
        <div className="absolute left-4 text-sm">
          {logic?.superReady ? "SUPER READY!" : `POWER: ${logic?.playerHits}/5`}
        </div>

        <div className="text-2xl text-cyan-300">
          あなた {logic?.playerScore} - {logic?.enemyScore} CPU
        </div>

        <button
          onClick={() => router.back()}
          className="absolute right-4 px-3 py-1 bg-white/20 text-white rounded-md text-sm active:scale-95"
        >
          ホーム
        </button>
      </div>

      <div
        className="relative flex-1 bg-[#080812] border-y border-cyan-500/20"
        onMouseMove={handleMove}
        onMouseDown={handleDown}
        onTouchMove={handleTouchMove}
        onTouchStart={handleDown}
      >
        <div
          className="absolute bg-cyan-400/40"
          style={
            isPortrait
              ? { left: 0, right: 0, top: "50%", height: "2px" }
              : { top: 0, bottom: 0, left: "50%", width: "2px" }
          }
        />

        {logic && (
          <div
            className="absolute bg-cyan-300 rounded-xl"
            style={{
              width: logic.player.w,
              height: logic.player.h,
              left: logic.player.x,
              top: logic.player.y,
            }}
          />
        )}

        {logic && (
          <div
            className="absolute bg-cyan-300 rounded-xl"
            style={{
              width: logic.enemy.w,
              height: logic.enemy.h,
              left: logic.enemy.x,
              top: logic.enemy.y,
            }}
          />
        )}

        {logic && (
          <div
            className="absolute rounded-full bg-teal-300 shadow-[0_0_20px_5px_rgba(0,255,200,0.5)]"
            style={{
              width: logic.puck.w,
              height: logic.puck.h,
              left: logic.puck.x,
              top: logic.puck.y,
            }}
          />
        )}
      </div>

      <div className="h-10"></div>
    </main>
  );
}
