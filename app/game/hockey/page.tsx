"use client";
import { useEffect, useRef, useState } from "react";
import { GameLogic } from "@/app/game/hockey/gamehockeyLogic";

export default function GameScreen() {
  const logicRef = useRef<GameLogic | null>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const [, setTick] = useState(0);
  const [isPortrait, setIsPortrait] = useState(false);
  const [started, setStarted] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [hitTrigger, setHitTrigger] = useState(false);
  const [wallHitTrigger, setWallHitTrigger] = useState(false);
  const [goalHighTrigger, setGoalHighTrigger] = useState(false);
  const [goalLowTrigger, setGoalLowTrigger] = useState(false);

  // ★ 音プール（ヒット・壁）
  const hitPool = useRef<HTMLAudioElement[]>([]);
  const wallPool = useRef<HTMLAudioElement[]>([]);
  const hitIndex = useRef(0);
  const wallIndex = useRef(0);

  // ★ ゴール音（単発）
  const goalHighSE = useRef<HTMLAudioElement | null>(null);
  const goalLowSE = useRef<HTMLAudioElement | null>(null);

  // ★ 音初期化
  useEffect(() => {
    hitPool.current = Array.from(
      { length: 5 },
      () => new Audio("/sounds/hockey/pim.mp3"),
    );
    wallPool.current = Array.from(
      { length: 5 },
      () => new Audio("/sounds/hockey/pom.mp3"),
    );

    goalHighSE.current = new Audio("/sounds/win.mp3");
    goalLowSE.current = new Audio("/sounds/lose.mp3");
  }, []);

  // ★ 画面向きチェック
  useEffect(() => {
    const check = () => setIsPortrait(window.innerHeight > window.innerWidth);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ★ BGM（必要なら）
  const bgmRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    const bgm = new Audio("/sounds/.mp3");
    bgm.loop = true;
    bgm.volume = 0.5;
    bgmRef.current = bgm;
    return () => bgm.pause();
  }, []);

  // ★ ゲーム開始時の初期化
  useEffect(() => {
    if (!started) return;

    const init = () => {
      const field = fieldRef.current;
      if (!field) return;

      const width = field.clientWidth;
      const height = field.clientHeight;

      if (!logicRef.current) {
        logicRef.current = new GameLogic(
          width,
          height,
          4,
          1.0,
          isPortrait,
          (type) => {
            if (type === "high") setGoalHighTrigger(true);
            else setGoalLowTrigger(true);
          },
          () => setHitTrigger(true),
          () => setWallHitTrigger(true),
        );
      }
    };

    init();

    let frame: number;
    const loop = () => {
      const result = logicRef.current?.update();
      if (result === "reset") setShowReset(true);

      setTick((t) => t + 1);
      frame = requestAnimationFrame(loop);
    };

    loop();
    return () => cancelAnimationFrame(frame);
  }, [started]);

  const logic = logicRef.current;

  // ★ 完全リセット
  const resetGame = () => {
    const field = fieldRef.current;
    if (!field) return;

    const width = field.clientWidth;
    const height = field.clientHeight;

    const prevMax = logicRef.current?.maxReflectCount ?? 0;

    const newLogic = new GameLogic(
      width,
      height,
      4,
      1.0,
      isPortrait,
      (type) => {
        if (type === "high") setGoalHighTrigger(true);
        else setGoalLowTrigger(true);
      },
      () => setHitTrigger(true),
      () => setWallHitTrigger(true),
    );

    newLogic.maxReflectCount = prevMax;
    newLogic.resetRound(true);

    logicRef.current = newLogic;
    setShowReset(false);
    setTick((t) => t + 1);
  };

  // ★ ヒット音（プール）
  useEffect(() => {
    if (hitTrigger) {
      const audio = hitPool.current[hitIndex.current];
      audio.currentTime = 0;
      audio.play();
      hitIndex.current = (hitIndex.current + 1) % hitPool.current.length;
      setHitTrigger(false);
    }
  }, [hitTrigger]);

  // ★ 壁音（プール）
  useEffect(() => {
    if (wallHitTrigger) {
      const audio = wallPool.current[wallIndex.current];
      audio.currentTime = 0;
      audio.play();
      wallIndex.current = (wallIndex.current + 1) % wallPool.current.length;
      setWallHitTrigger(false);
    }
  }, [wallHitTrigger]);

  // ★ ゴール音（単発）
  useEffect(() => {
    if (goalHighTrigger) {
      goalHighSE.current?.play();
      setGoalHighTrigger(false);
    }
  }, [goalHighTrigger]);

  useEffect(() => {
    if (goalLowTrigger) {
      goalLowSE.current?.play();
      setGoalLowTrigger(false);
    }
  }, [goalLowTrigger]);

  // ★ マウス移動
  const handleMove = (e: React.MouseEvent) => {
    if (!logic || !fieldRef.current) return;
    const rect = fieldRef.current.getBoundingClientRect();
    const pos = isPortrait ? e.clientX - rect.left : e.clientY - rect.top;
    logic.movePlayer(pos);
  };

  // ★ タッチ移動
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!logic || !fieldRef.current) return;
    const touch = e.touches[0];
    const rect = fieldRef.current.getBoundingClientRect();
    const pos = isPortrait
      ? touch.clientX - rect.left
      : touch.clientY - rect.top;
    logic.movePlayer(pos);
  };

  return (
    <main
      className={`
        w-full min-h-[100dvh] bg-[#080812]
        flex flex-col relative overflow-hidden touch-none
        pt-8 p-4 border-4 border-sky-300 rounded-2xl shadow-2xl
        ${started && !showReset ? "md:cursor-none" : "md:cursor-auto"}
      `}
    >
      {started && (
        <div className="fixed top-0 left-0 w-full z-[99999] pointer-events-none">
          <div className="flex justify-center items-center text-white text-xs pt-1 relative">
            <span className="text-base text-cyan-300 font-bold">
              スコア: {logic?.reflectCount ?? 0}
            </span>
            <span className="text-base absolute right-4 text-cyan-500 font-bold">
              最大スコア: {logic?.maxReflectCount ?? 0}
            </span>
          </div>
        </div>
      )}

      {!started && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <button
            onClick={() => setStarted(true)}
            className="px-6 py-3 bg-cyan-400 text-black font-bold rounded-lg shadow-lg active:scale-95 mt-[-25px]"
          >
            GAME START
          </button>
        </div>
      )}

      {showReset && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <button
            onClick={resetGame}
            className="px-6 py-3 bg-yellow-300 text-black font-bold rounded-lg shadow-lg active:scale-95 mt-[-25px]"
          >
            GAME RESET
          </button>
        </div>
      )}

      {/* ★ ゲームフィールド */}
      <div
        ref={fieldRef}
        className="relative flex-1 bg-[#080812] border-y border-cyan-500/20"
        style={{ marginLeft: "-1rem", marginRight: "-1rem" }}
        onMouseMove={handleMove}
        onTouchMove={handleTouchMove}
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
