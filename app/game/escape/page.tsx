"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function ObachanGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false); // ★ 追加
  const router = useRouter();
  const loopRef = useRef<number | null>(null);

  const state = useRef({
    obachan: { x: 0, y: 0 },
    enemy: { x: 0, y: 0 },
    item: { x: 0, y: 0 },
  });

  const dist = (a: any, b: any) =>
    Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);

  const reset = (width: number, height: number) => {
    state.current = {
      obachan: { x: width / 2, y: height / 2 },
      enemy: {
        x: Math.random() * (width - 100) + 50,
        y: Math.random() * (height - 100) + 50,
      },
      item: {
        x: Math.random() * (width - 100) + 50,
        y: Math.random() * (height - 100) + 50,
      },
    };

    setScore(0);
    setGameOver(false); // ★ UI 側もリセット
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

  // ゲームループ
  useEffect(() => {
    if (!running) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // ★ 古いループを止める
    if (loopRef.current) cancelAnimationFrame(loopRef.current);

    const loop = () => {
      const WIDTH = canvas.width;
      const HEIGHT = canvas.height;
      const s = state.current;

      const keys = (window as any).keys ?? {};
      const speed = 4;

      if (!gameOver) {
        if (keys["ArrowLeft"]) s.obachan.x -= speed;
        if (keys["ArrowRight"]) s.obachan.x += speed;
        if (keys["ArrowUp"]) s.obachan.y -= speed;
        if (keys["ArrowDown"]) s.obachan.y += speed;

        s.obachan.x = Math.max(0, Math.min(WIDTH, s.obachan.x));
        s.obachan.y = Math.max(0, Math.min(HEIGHT, s.obachan.y));

        const dx = s.obachan.x - s.enemy.x;
        const dy = s.obachan.y - s.enemy.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d !== 0) {
          s.enemy.x += (2 * dx) / d;
          s.enemy.y += (2 * dy) / d;
        }

        if (dist(s.obachan, s.item) < 20) {
          setScore((prev) => prev + 1);
          s.item.x = Math.random() * (WIDTH - 100) + 50;
          s.item.y = Math.random() * (HEIGHT - 100) + 50;
        }

        if (dist(s.obachan, s.enemy) < 30) {
          setGameOver(true);
        }
      }

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
      ctx.arc(s.obachan.x, s.obachan.y, 6, 0, Math.PI * 2);
      ctx.fill();

      if (gameOver) {
        ctx.fillStyle = "red";
        ctx.font = "24px sans-serif";
        ctx.fillText("GAME OVER", WIDTH / 2 - 80, HEIGHT / 2);
      }

      // ★ ループ ID を保存
      loopRef.current = requestAnimationFrame(loop);
    };

    loop();
  }, [running, gameOver]);

  // キー入力
  useEffect(() => {
    (window as any).keys = {};

    const down = (e: KeyboardEvent) => {
      (window as any).keys[e.key] = true;
    };

    const up = (e: KeyboardEvent) => {
      (window as any).keys[e.key] = false;
    };

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);

    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden touch-none">
      {/* ★ 上部ヘッダー */}
      <div className="w-full h-[30px] bg-black/70 text-white flex items-center justify-between px-4 z-20">
        <div className="flex-1"></div>

        <div className="text-lg font-bold flex-1 text-center">
          Score: {score}
        </div>

        <div className="flex-1 flex justify-end">
          <button
            onClick={() => router.back()}
            className="px-4 py-1 bg-white/15 rounded-md active:scale-95"
          >
            ホーム
          </button>
        </div>
      </div>

      {/* ★ ゲーム開始ボタン */}
      {!running && (
        <button
          onClick={() => {
            const canvas = canvasRef.current;
            if (canvas) reset(canvas.width, canvas.height);
            setRunning(true);
          }}
          className="px-6 py-3 bg-pink-400 text-black font-bold rounded-lg shadow-lg active:scale-95 z-20 absolute top-[45%] left-1/2 -translate-x-1/2"
        >
          GAME START
        </button>
      )}

      {/* ★ ゲーム画面 */}
      <canvas
        ref={canvasRef}
        className="touch-none flex-1"
        onMouseMove={(e) => {
          const rect = canvasRef.current?.getBoundingClientRect();
          if (!rect) return;
          state.current.obachan.x = e.clientX - rect.left;
          state.current.obachan.y = e.clientY - rect.top;
        }}
        onTouchStart={(e) => {
          const rect = canvasRef.current?.getBoundingClientRect();
          if (!rect) return;
          const t = e.touches[0];
          state.current.obachan.x = t.clientX - rect.left;
          state.current.obachan.y = t.clientY - rect.top;
        }}
        onTouchMove={(e) => {
          const rect = canvasRef.current?.getBoundingClientRect();
          if (!rect) return;
          const t = e.touches[0];
          state.current.obachan.x = t.clientX - rect.left;
          state.current.obachan.y = t.clientY - rect.top;
        }}
      />

      {/* ★ ゲームオーバー時だけ RESET ボタン */}
      {gameOver && (
        <button
          onClick={() => {
            const canvas = canvasRef.current;
            if (canvas) reset(canvas.width, canvas.height);
          }}
          className="px-6 py-3 bg-white/80 text-black font-bold rounded-lg shadow-lg active:scale-95 z-20 absolute top-[50%] left-1/2 -translate-x-1/2"
        >
          RESET
        </button>
      )}
    </div>
  );
}
