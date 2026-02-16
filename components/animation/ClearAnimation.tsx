"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export const ClearAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesCount = 20;

  // ブラウザのサイズを安全に取得するためのステート
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // 1. windowサイズのセット（ブラウザでのみ実行される）
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    // 2. 音声の再生（ブラウザでのみ実行される）
    const audio = new Audio("/sounds/clear.mp3");
    audio.volume = 0.9;
    audio.play().catch(() => {
      console.log("Audio play blocked by browser");
    });

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;
    // 初期サイズをセット
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 60 }).map(() => ({
      x: canvas.width / 2,
      y: canvas.height / 2,
      angle: Math.random() * Math.PI * 2,
      speed: 2 + Math.random() * 3,
      size: 2 + Math.random() * 3,
      alpha: 1,
    }));

    let frame = 0;
    const render = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += Math.cos(p.angle) * p.speed;
        p.y += Math.sin(p.angle) * p.speed;
        p.alpha -= 0.015;

        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = "rgba(255, 230, 120, 1)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      if (frame < 120) requestAnimationFrame(render);
    };

    render();
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] flex items-center justify-center">
      {/* 背景フラッシュ演出 */}
      <motion.div
        className="absolute inset-0 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.35 }}
      />
      <motion.div
        className="absolute inset-0 bg-yellow-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.8, 0] }}
        transition={{ duration: 0.5, delay: 0.05 }}
      />

      {/* グラデーション爆発 */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle, rgba(255,240,150,0.9), rgba(255,200,0,0.3), transparent)",
        }}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 2.5, opacity: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      />

      {/* アニメーション要素（省略せず維持） */}
      <div className="relative w-0 h-0">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={`ripple-${i}`}
            className="absolute top-1/2 left-1/2 w-40 h-40 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-yellow-300"
            initial={{ scale: 0.2, opacity: 1 }}
            animate={{ scale: 4 + i * 1.2, opacity: 0 }}
            transition={{ duration: 1.6 + i * 0.3, ease: "easeOut" }}
          />
        ))}

        {[...Array(8)].map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          return (
            <motion.div
              key={`beam-${i}`}
              className="absolute top-1/2 left-1/2 w-1 h-32 bg-yellow-200 rounded-full origin-bottom -translate-x-1/2 -translate-y-full"
              style={{ rotate: `${(angle * 180) / Math.PI}deg` }}
              initial={{ scaleY: 0, opacity: 1 }}
              animate={{ scaleY: 1.5, opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          );
        })}

        {[...Array(particlesCount)].map((_, i) => {
          const angle = (i / particlesCount) * Math.PI * 2;
          const distance = 250;
          return (
            <motion.div
              key={`particle-${i}`}
              className="absolute top-1/2 left-1/2 w-3 h-3 bg-yellow-300 rounded-full shadow-xl -translate-x-1.5 -translate-y-1.5"
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{
                x: Math.cos(angle) * distance,
                y: Math.sin(angle) * distance,
                opacity: 0,
                scale: 0.2,
              }}
              transition={{ duration: 1.4, ease: "easeOut" }}
            />
          );
        })}
      </div>

      <canvas
        ref={canvasRef}
        /* window.innerWidth ではなく dimensions を使うことで SSR 時のエラーを回避 */
        width={dimensions.width}
        height={dimensions.height}
        className="absolute inset-0"
      />
    </div>
  );
};
