// app/game/x/GameCanvas.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import kaplay, { KAPLAYCtx } from "kaplay";
import { setupHighLowVisual } from "./highlow/highlowLogic";
import { HighLowEffect } from "./highlow/HighLowEffect";
import { useHighLow } from "./highlow/useHighLow";
import { HighLowUI } from "./highlow/HighLowUI";

export default function GameCanvas() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const kRef = useRef<KAPLAYCtx | null>(null);
  const isInitializing = useRef(false);

  const [scene, setScene] = useState<"title" | "menu" | "game">("title");
  const [isKaplayReady, setIsKaplayReady] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { score, currentNum, gameMsg, isProcessing, handleGuess, resetGame } =
    useHighLow();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleStartMission = () => {
    if (wrapperRef.current && !document.fullscreenElement) {
      wrapperRef.current.requestFullscreen().catch(() => {});
    }
    resetGame();
    setScene("menu");
  };

  useEffect(() => {
    if (
      !mounted ||
      isInitializing.current ||
      kRef.current ||
      !containerRef.current
    )
      return;
    isInitializing.current = true;

    containerRef.current.innerHTML = "";
    const canvas = document.createElement("canvas");
    containerRef.current.appendChild(canvas);

    const kInstance = kaplay({
      canvas,
      width: 640,
      height: 480,
      background: [20, 80, 20],
      letterbox: true, // これにより、どのアスペクト比でも640x480の領域が維持される
      global: false,
      loadingScreen: false,
    });

    kRef.current = kInstance;
    setupHighLowVisual(kInstance);
    setIsKaplayReady(true);
    kInstance.go(scene === "game" ? "highlow_play" : "blank");

    return () => {
      kRef.current?.quit();
      kRef.current = null;
      isInitializing.current = false;
    };
  }, [mounted]);

  useEffect(() => {
    if (kRef.current && isKaplayReady) {
      kRef.current.go(scene === "game" ? "highlow_play" : "blank");
    }
  }, [scene, isKaplayReady]);

  if (!mounted) return null;

  return (
    <div
      ref={wrapperRef}
      className="relative w-full h-full bg-black flex items-center justify-center font-sans text-white select-none overflow-hidden"
    >
      {/* 演出用のPixiエフェクト（全画面） */}
      <HighLowEffect />

      {/* ゲームエリアのコンテナ: 
        KAPLAYの letterbox と同じ 4:3 の比率を維持する。
        aspect-video (16:9) ではなく 640/480 なので aspect-[4/3] を使用。
      */}
      <div className="relative w-full h-full max-w-[calc(100vh*4/3)] aspect-[4/3] flex items-center justify-center overflow-hidden bg-[#145014]">
        {/* KAPLAY キャンバスレイヤー */}
        <div
          ref={containerRef}
          className={`absolute inset-0 z-0 transition-opacity duration-700 ${
            isKaplayReady ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* React UI レイヤー (KAPLAYと完全に同じ枠内に配置) */}
        <div className="absolute inset-0 z-10 flex flex-col items-center pointer-events-none">
          {scene === "title" && (
            <div className="flex-1 flex flex-col items-center justify-center pointer-events-auto">
              <h1 className="text-5xl sm:text-7xl font-black mb-12 italic drop-shadow-2xl text-center">
                PROJECT X
              </h1>
              <button
                onClick={handleStartMission}
                className="px-12 py-5 bg-white text-black text-xl font-black rounded-full hover:scale-110 transition-transform shadow-xl"
              >
                START MISSION
              </button>
            </div>
          )}

          {scene === "menu" && (
            <div className="flex-1 flex flex-col items-center justify-center pointer-events-auto gap-6 w-full max-w-sm px-6">
              <h2 className="text-3xl font-bold tracking-widest mb-4">
                SELECT MISSION
              </h2>
              <button
                onClick={() => setScene("game")}
                className="w-full py-8 border-4 border-white/40 bg-white/5 backdrop-blur-md rounded-3xl text-2xl font-black hover:bg-white hover:text-black transition-all"
              >
                HIGH & LOW
              </button>
              <button
                onClick={() => router.push("/")}
                className="w-full py-4 bg-red-950/40 hover:bg-red-600 rounded-xl transition-all border border-red-500/30 text-sm font-bold uppercase tracking-widest"
              >
                EXIT TO HOME
              </button>
            </div>
          )}

          {scene === "game" && (
            <HighLowUI
              score={score}
              currentNum={currentNum}
              gameMsg={gameMsg}
              isProcessing={isProcessing}
              onGuess={handleGuess}
              onQuit={() => setScene("menu")}
            />
          )}
        </div>
      </div>
    </div>
  );
}
