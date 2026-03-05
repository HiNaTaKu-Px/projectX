"use client";

import GameCanvas from "./GameCanvas";
import { HighLowEffect } from "./highlow/HighLowEffect";
export default function GamePage() {
  return (
    <main
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1a1a1a",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "95%",
          maxWidth: "640px",
          aspectRatio: "4 / 3",
          border: "4px solid #333",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
          touchAction: "none",
        }}
      >
        {/* 背景：KAPLAY (カード本体) */}
        <GameCanvas />

        {/* 前景：PixiJS (キラキラ演出) */}
        <HighLowEffect />

        <div
          style={{
            position: "absolute",
            bottom: "10px",
            width: "100%",
            textAlign: "center",
            color: "white",
            fontFamily: "sans-serif",
            pointerEvents: "none",
            textShadow: "1px 1px 2px black",
          }}
        ></div>
      </div>
    </main>
  );
}
