"use client";

import { useEffect, useRef, useState } from "react";

export function useEscapeGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const loopRef = useRef<number | null>(null);
  const stick = useRef({ x: 0, y: 0 });

  const state = useRef({
    player: { x: 0, y: 0 },
    enemy: { x: 0, y: 0 },
    item: { x: 0, y: 0 },
  });

  const dist = (a: any, b: any) =>
    Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);

  const reset = (width: number, height: number) => {
    state.current = {
      player: { x: width / 2, y: height / 2 },
      enemy: {
        x: Math.random() * (width - 100) + 50,
        y: 40,
      },
      item: {
        x: Math.random() * (width - 100) + 50,
        y: Math.random() * (height - 100) + 50,
      },
    };

    setScore(0);
    setGameOver(false);
  };

  // Canvas サイズ調整
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const headerHeight = 30;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight - headerHeight;
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // ★★★★★ PC マウス操作を追加 ★★★★★
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!running || gameOver) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      state.current.player.x = x;
      state.current.player.y = y;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [running, gameOver]);

  // スティック操作（スマホ用）
  const handleStickMove = (e: any) => {
    const touch = e.touches[0];
    const area = (e.target as HTMLElement).getBoundingClientRect();

    const cx = area.left + area.width / 2;
    const cy = area.top + area.height / 2;

    let dx = touch.clientX - cx;
    let dy = touch.clientY - cy;

    const maxDist = 40;
    const d = Math.sqrt(dx * dx + dy * dy);

    if (d > maxDist) {
      dx = (dx / d) * maxDist;
      dy = (dy / d) * maxDist;
    }

    stick.current.x = dx / maxDist;
    stick.current.y = dy / maxDist;

    const stickElem = document.getElementById("stick");
    if (stickElem) {
      stickElem.style.transform = `translate(${dx}px, ${dy}px)`;
    }
  };

  const handleStickEnd = () => {
    stick.current = { x: 0, y: 0 };
    const stickElem = document.getElementById("stick");
    if (stickElem) {
      stickElem.style.transform = "translate(-50%, -50%)";
    }
  };

  // ゲームループ（元のまま）
  useEffect(() => {
    if (!running) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    if (loopRef.current) cancelAnimationFrame(loopRef.current);

    const loop = () => {
      const WIDTH = canvas.width;
      const HEIGHT = canvas.height;
      const s = state.current;

      const keys = (window as any).keys ?? {};
      const speed = 4;

      if (!gameOver) {
        // キーボード操作
        if (keys["ArrowLeft"]) s.player.x -= speed;
        if (keys["ArrowRight"]) s.player.x += speed;
        if (keys["ArrowUp"]) s.player.y -= speed;
        if (keys["ArrowDown"]) s.player.y += speed;

        // スティック操作（スマホ）
        const sensitivity = 1.0;
        s.player.x += stick.current.x * speed * sensitivity;
        s.player.y += stick.current.y * speed * sensitivity;

        // 画面外に出ないように
        s.player.x = Math.max(0, Math.min(WIDTH, s.player.x));
        s.player.y = Math.max(0, Math.min(HEIGHT, s.player.y));

        // 敵が追いかける
        const dx = s.player.x - s.enemy.x;
        const dy = s.player.y - s.enemy.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d !== 0) {
          s.enemy.x += (2 * dx) / d;
          s.enemy.y += (2 * dy) / d;
        }

        // アイテム取得
        if (dist(s.player, s.item) < 20) {
          setScore((prev) => {
            const newScore = prev + 1;
            setMaxScore((m) => Math.max(m, newScore));
            return newScore;
          });

          s.item.x = Math.random() * (WIDTH - 100) + 50;
          s.item.y = Math.random() * (HEIGHT - 100) + 50;
        }

        // 敵に当たったら終了
        if (dist(s.player, s.enemy) < 30) {
          setGameOver(true);
        }
      }

      // 描画
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      ctx.fillStyle = "yellow";
      ctx.beginPath();
      ctx.arc(s.item.x, s.item.y, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(s.enemy.x, s.enemy.y, 12, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "pink";
      ctx.beginPath();
      ctx.arc(s.player.x, s.player.y, 6, 0, Math.PI * 2);
      ctx.fill();

      if (gameOver) {
        ctx.fillStyle = "red";
        ctx.font = "24px sans-serif";
        const text = "GAME OVER";
        const textWidth = ctx.measureText(text).width;
        ctx.fillText(text, WIDTH / 2 - textWidth / 2, HEIGHT / 2 - 40);
      }

      loopRef.current = requestAnimationFrame(loop);
    };

    loop();
  }, [running, gameOver]);

  return {
    canvasRef,
    running,
    setRunning,
    score,
    maxScore,
    gameOver,
    reset,
    handleStickMove,
    handleStickEnd,
  };
}
