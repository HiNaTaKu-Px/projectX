"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { saveScoreAction } from "./actions"; // パスを調整

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

  const savedRef = useRef(false);

  // ★ サーバーアクションを使用して保存
  const persistScore = useCallback(async (value: number) => {
    if (value <= 0) return;
    try {
      await saveScoreAction(value);
      console.log("Escape score saved:", value);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const backGame = async () => {
    if (!savedRef.current && maxScore > 0) {
      savedRef.current = true;
      await persistScore(maxScore);
    }
  };

  const dist = (a: any, b: any) => Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);

  const reset = (width: number, height: number) => {
    state.current = {
      player: { x: width / 2, y: height / 2 },
      enemy: { x: Math.random() * (width - 100) + 50, y: 40 },
      item: { x: Math.random() * (width - 100) + 50, y: Math.random() * (height - 100) + 50 },
    };
    savedRef.current = false;
    setScore(0);
    setGameOver(false);
  };

  // Canvasリサイズ
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight - 30;
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // マウス/スティック操作ロジックは以前と同様
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
    if (stickElem) stickElem.style.transform = `translate(${dx}px, ${dy}px)`;
  };

  const handleStickEnd = () => {
    stick.current = { x: 0, y: 0 };
    const stickElem = document.getElementById("stick");
    if (stickElem) stickElem.style.transform = "translate(-50%, -50%)";
  };

  // ゲームループ
  useEffect(() => {
    if (!running) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const loop = () => {
      const WIDTH = canvas.width;
      const HEIGHT = canvas.height;
      const s = state.current;
      const speed = 4;

      if (!gameOver) {
        s.player.x += stick.current.x * speed;
        s.player.y += stick.current.y * speed;
        s.player.x = Math.max(0, Math.min(WIDTH, s.player.x));
        s.player.y = Math.max(0, Math.min(HEIGHT, s.player.y));

        const dx = s.player.x - s.enemy.x;
        const dy = s.player.y - s.enemy.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d !== 0) {
          s.enemy.x += (2 * dx) / d;
          s.enemy.y += (2 * dy) / d;
        }

        if (dist(s.player, s.item) < 20) {
          setScore((prev) => {
            const next = prev + 1;
            setMaxScore((m) => Math.max(m, next));
            return next;
          });
          s.item.x = Math.random() * (WIDTH - 100) + 50;
          s.item.y = Math.random() * (HEIGHT - 100) + 50;
        }

        if (dist(s.player, s.enemy) < 15) {
          setGameOver(true);
        }
      }

      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
      ctx.fillStyle = "yellow"; ctx.beginPath(); ctx.arc(s.item.x, s.item.y, 8, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "red"; ctx.beginPath(); ctx.arc(s.enemy.x, s.enemy.y, 12, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "pink"; ctx.beginPath(); ctx.arc(s.player.x, s.player.y, 6, 0, Math.PI * 2); ctx.fill();

      loopRef.current = requestAnimationFrame(loop);
    };

    loop();
    return () => { if (loopRef.current) cancelAnimationFrame(loopRef.current); };
  }, [running, gameOver]);

  // ★ ゲームオーバー時に自動保存
  useEffect(() => {
    if (gameOver && !savedRef.current && maxScore > 0) {
      savedRef.current = true;
      persistScore(maxScore);
    }
  }, [gameOver, maxScore, persistScore]);

  return { canvasRef, running, setRunning, score, maxScore, gameOver, reset, handleStickMove, handleStickEnd, backGame };
}