"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import kaplay, { KAPLAYCtx } from "kaplay";
import { setupGameVisual } from "./components/visualLogic";
import { useGlobalStore } from "./logic/useGlobalStore";
import { useHighLowStore } from "./games/highlow/useHighLowStore";
import { useClashStore } from "./games/clash/useClashStore";
import { useBjStore } from "./games/bj/useBjStore";
import { HighLowUI } from "./games/highlow/HighLowUI";
import { ClashUI } from "./games/clash/ClashUI";
import { BjUI } from "./games/bj/BjUI";
import { saveGameData } from "./logic/actions";
import { GameOverlayEffect } from "@/app/game/x/components/GameOverlayEffect";

import { TitleView } from "./components/TitleView";
import { MenuView } from "./components/MenuView";
import { GameOverView } from "./components/GameOverView";

// ★ initialAvatar を Props に追加
export default function GamePageClient({
  initialCoins,
  initialScores,
  initialAvatar,
}: any) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const kRef = useRef<KAPLAYCtx | null>(null);
  const isInitializing = useRef(false);

  const [scene, setScene] = useState<"title" | "menu" | "game">("title");
  const [isKaplayReady, setIsKaplayReady] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMenuSaving, setIsMenuSaving] = useState(false);

  const [isGameOver, setIsGameOver] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);
  const [lastMultiplier, setLastMultiplier] = useState(0);

  const {
    activeGame,
    setGame,
    resetStreak,
    streak,
    coins,
    gameBestScores,
    syncData,
    resolveWin,
    resolveLoss,
    addStreak,
    avatar, // ★ Store から現在のアバター状態を取得
  } = useGlobalStore();

  const resetHighLow = useHighLowStore((s) => s.resetGame);
  const startClashRound = useClashStore((s) => s.startRound);
  const resetBj = useBjStore((s) => s.resetGame);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ★ 修正: syncData に initialAvatar を渡す
  useEffect(() => {
    if (mounted) syncData(initialCoins, initialScores, initialAvatar);
  }, [mounted, initialCoins, initialScores, initialAvatar, syncData]);

  const handleStartMission = () => {
    if (wrapperRef.current && !document.fullscreenElement)
      wrapperRef.current.requestFullscreen().catch(() => {});
    setScene("menu");
  };

  const handleSelectGame = (type: "highlow" | "clash" | "bj") => {
    setIsGameOver(false);
    setGame(type);
    if (type === "highlow") resetHighLow();
    if (type === "clash") startClashRound();
    if (type === "bj") resetBj();
    setScene("game");
  };

  const handleGameOver = (score: number, multiplier: number = 0) => {
    setCurrentScore(score);
    setLastMultiplier(multiplier);
    setIsGameOver(true);
  };

  const handleRetry = () => {
    if (lastMultiplier > 0) {
      addStreak();
      resolveWin(lastMultiplier);
    } else {
      resolveLoss();
    }

    setIsGameOver(false);
    if (activeGame === "highlow") resetHighLow();
    if (activeGame === "clash") startClashRound();
    if (activeGame === "bj") resetBj();
  };

  // ★ 修正: saveGameData に avatar を追加
  const handleQuit = async () => {
    setIsGameOver(false);
    await saveGameData(coins, streak, activeGame, gameBestScores, avatar);
    setGame("none");
    setScene("menu");
    resetStreak();
  };

  // ★ 修正: saveGameData に avatar を追加
  const handleExit = async () => {
    if (isMenuSaving) return;
    setIsMenuSaving(true);
    await saveGameData(
      coins,
      streak,
      activeGame,
      gameBestScores,
      avatar,
    ).finally(() => router.push("/"));
  };

  useEffect(() => {
    if (!mounted || isInitializing.current || !containerRef.current) return;
    isInitializing.current = true;
    const kInstance = kaplay({
      canvas: containerRef.current.appendChild(
        document.createElement("canvas"),
      ),
      width: 640,
      height: 480,
      background: [20, 80, 20],
      letterbox: true,
      global: false,
    });
    setupGameVisual(kInstance);
    kRef.current = kInstance;
    setIsKaplayReady(true);
    return () => {
      kRef.current?.quit();
      isInitializing.current = false;
    };
  }, [mounted]);

  useEffect(() => {
    if (kRef.current && isKaplayReady)
      kRef.current.go(scene === "game" ? "game_active" : "blank");
  }, [scene, isKaplayReady]);

  if (!mounted) return null;

  return (
    <div
      ref={wrapperRef}
      className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden"
    >
      <div className="relative w-full h-full max-w-[calc(100vh*4/3)] aspect-4/3 flex items-center justify-center bg-[#145014]">
        <div
          ref={containerRef}
          className={`absolute inset-0 z-0 transition-opacity ${isKaplayReady ? "opacity-100" : "opacity-0"}`}
        />

        <div className="absolute inset-0 z-10 flex flex-col items-center pointer-events-none">
          {scene === "title" && <TitleView onStart={handleStartMission} />}

          {scene === "menu" && (
            <MenuView
              coins={coins}
              gameBestScores={gameBestScores}
              onSelect={handleSelectGame}
              onExit={handleExit}
              isSaving={isMenuSaving}
            />
          )}

          {scene === "game" && (
            <div className="w-full h-full pointer-events-auto relative">
              {activeGame === "highlow" && (
                <HighLowUI onQuit={handleQuit} onGameOver={handleGameOver} />
              )}
              {activeGame === "clash" && (
                <ClashUI onQuit={handleQuit} onGameOver={handleGameOver} />
              )}
              {activeGame === "bj" && (
                <BjUI onQuit={handleQuit} onGameOver={handleGameOver} />
              )}

              {isGameOver && (
                <GameOverView
                  score={currentScore}
                  highscore={gameBestScores[activeGame || ""] || 0}
                  multiplier={lastMultiplier}
                  onRetry={handleRetry}
                />
              )}
            </div>
          )}
        </div>

        <GameOverlayEffect />
      </div>
    </div>
  );
}
