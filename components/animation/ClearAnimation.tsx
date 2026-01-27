"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

export const ClearAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = Array.from({ length: 20 });

  // --- Canvas 粒子（ClearAnimation1 の要素） ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;
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
      {/* --- 白フラッシュ（両方共通） --- */}
      <motion.div
        className="absolute inset-0 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.35 }}
      />

      {/* --- 金色フラッシュ（ClearAnimation1） --- */}
      <motion.div
        className="absolute inset-0 bg-yellow-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.8, 0] }}
        transition={{ duration: 0.5, delay: 0.05 }}
      />

      {/* --- 放射状グラデーション爆発（ClearAnimation1） --- */}
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

      {/* --- 光輪（ClearAnimation1） --- */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-80 h-80 rounded-full -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "conic-gradient(from 0deg, yellow, white, yellow, transparent 60%)",
        }}
        initial={{ rotate: 0, opacity: 1, scale: 0.6 }}
        animate={{ rotate: 360, opacity: 0, scale: 2 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />

      {/* --- SVG バースト（ClearAnimation1） --- */}
      <motion.svg
        className="absolute top-1/2 left-1/2 w-48 h-48 -translate-x-1/2 -translate-y-1/2"
        initial={{ scale: 0.3, opacity: 1 }}
        animate={{ scale: 3, opacity: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        <path
          d="M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z"
          fill="rgba(255,230,120,1)"
        />
      </motion.svg>

      {/* --- ClearAnimation2 の中心アニメーション --- */}
      <div className="relative w-0 h-0">
        {/* 波紋（ClearAnimation2） */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={`ripple-${i}`}
            className="absolute top-1/2 left-1/2 w-40 h-40 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-yellow-300"
            initial={{ scale: 0.2, opacity: 1 }}
            animate={{ scale: 4 + i * 1.2, opacity: 0 }}
            transition={{ duration: 1.6 + i * 0.3, ease: "easeOut" }}
          />
        ))}

        {/* 光線（ClearAnimation2） */}
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

        {/* 放射状粒子（ClearAnimation2） */}
        {particles.map((_, i) => {
          const angle = (i / particles.length) * Math.PI * 2;
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

      {/* --- Canvas 粒子（ClearAnimation1） --- */}
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        className="absolute inset-0"
      />
    </div>
  );
};
