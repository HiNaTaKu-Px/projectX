"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { GameLogic } from "./GameLogic";
import { playSound } from "@/components/sound/Sound";

export function useHockeyGame() {
  const logicRef = useRef<GameLogic | null>(null);
  const fieldRef = useRef<HTMLDivElement>(null);

  const [started, setStarted] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resultState, setResultState] = useState<"win" | "lose">("lose"); // ★ 追加
  const [, setTick] = useState(0);
  const [isPortrait, setIsPortrait] = useState(false);

  // SE
  const hitPool = useRef<HTMLAudioElement[]>([]);
  const wallPool = useRef<HTMLAudioElement[]>([]);
  const hitIndex = useRef(0);
  const wallIndex = useRef(0);
  const goalHighSE = useRef<HTMLAudioElement | null>(null);
  const goalLowSE = useRef<HTMLAudioElement | null>(null);

  const frameRef = useRef<number | null>(null);

  // --- DB保存用関数 ---
  const saveHighScore = async (score: number) => {
    try {
      await fetch("/api/highscore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          game: "hockey",
          value: score,
        }),
      });
      console.log("Score saved:", score);
    } catch (error) {
      console.error("Error saving high score:", error);
    }
  };

  // --- 共通のSE再生処理 ---
  const playHitSE = useCallback(() => {
    const audio = hitPool.current[hitIndex.current];
    if (audio) {
      audio.currentTime = 0;
      audio.play();
      hitIndex.current = (hitIndex.current + 1) % hitPool.current.length;
    }
  }, []);

  const playWallSE = useCallback(() => {
    const audio = wallPool.current[wallIndex.current];
    if (audio) {
      audio.currentTime = 0;
      audio.play();
      wallIndex.current = (wallIndex.current + 1) % wallPool.current.length;
    }
  }, []);

  // --- ゴール時の処理 ---
  const handleGoal = useCallback((type: "win" | "lose") => {
    setResultState(type); // ★ 勝敗状態を保存
    if (type === "win") {
      playSound("/sounds/win.mp3", 1);
    } else {
      playSound("/sounds/lose.mp3", 1);
    }
    setShowReset(true);
  }, []);

  // 向きチェック
  useEffect(() => {
    const check = () => setIsPortrait(window.innerHeight > window.innerWidth);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // 音初期化
  useEffect(() => {
    hitPool.current = Array.from(
      { length: 5 },
      () => new Audio("/sounds/hockey/pim.mp3"),
    );
    wallPool.current = Array.from(
      { length: 5 },
      () => new Audio("/sounds/hockey/pom.mp3"),
    );

    return () => {
      [...hitPool.current, ...wallPool.current].forEach((a) => {
        if (a) {
          a.pause();
          a.src = "";
        }
      });
    };
  }, []);

  // ゲーム開始
  const startGame = () => {
    const field = fieldRef.current;
    if (!field) return;

    logicRef.current = new GameLogic(
      field.clientWidth,
      field.clientHeight,
      4,
      1.0,
      isPortrait,
      handleGoal,
      playHitSE,
      playWallSE,
    );

    setStarted(true);

    const loop = () => {
      if (!logicRef.current) return;
      logicRef.current.update();
      setTick((t) => t + 1);
      frameRef.current = requestAnimationFrame(loop);
    };
    loop();
  };

  const resetGame = () => {
    const logic = logicRef.current;
    if (!logic || !fieldRef.current) return;

    if (logic.maxReflectCount > 0) {
      saveHighScore(logic.maxReflectCount);
    }

    logic.reflectCount = 0;
    logic.isGameOver = false;
    logic.resetRound(true);

    setShowReset(false);
    setTick((t) => t + 1);
  };

  const backGame = () => {
    const logic = logicRef.current;
    if (logic && logic.maxReflectCount > 0) {
      saveHighScore(logic.maxReflectCount);
    }
    setShowReset(false);
  };

  const handleMove = (e: React.MouseEvent) => {
    if (!logicRef.current || !fieldRef.current) return;
    const rect = fieldRef.current.getBoundingClientRect();
    logicRef.current.movePlayer(
      isPortrait ? e.clientX - rect.left : e.clientY - rect.top,
    );
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!logicRef.current || !fieldRef.current) return;
    const rect = fieldRef.current.getBoundingClientRect();
    logicRef.current.movePlayer(
      isPortrait
        ? e.touches[0].clientX - rect.left
        : e.touches[0].clientY - rect.top,
    );
  };

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      logicRef.current = null;
    };
  }, []);

  return {
    started,
    showReset,
    resultState, // ★ 追加
    logic: logicRef.current,
    fieldRef,
    startGame,
    resetGame,
    handleMove,
    handleTouchMove,
    backGame,
  };
}
