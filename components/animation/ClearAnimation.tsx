"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { playSound } from "@/components/sound/Sound";

export const ClearAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesCount = 20;

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // window サイズ取得
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    // ★ 音ロジックを共通化
    playSound("/sounds/clear.mp3");

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;
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
      {/* 以下はそのまま */}
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

      <div className="relative w-0 h-0">
        {/* ripple, beams, particles はそのまま */}
      </div>

      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="absolute inset-0"
      />
    </div>
  );
};
