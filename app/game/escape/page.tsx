"use client";
import { useEffect, useRef, useState } from "react";

export default function ObachanGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const loopRef = useRef<number | null>(null);
  const [maxScore, setMaxScore] = useState(0);

  const stick = useRef({ x: 0, y: 0 });

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

      // ★ 敵は上からスタート
      enemy: {
        x: Math.random() * (width - 100) + 50,
        y: 40,
      },

      // ★ アイテムはランダム（黄色は残す）
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

  // スティック操作
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

  // ゲームループ
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
        // キーボード
        if (keys["ArrowLeft"]) s.obachan.x -= speed;
        if (keys["ArrowRight"]) s.obachan.x += speed;
        if (keys["ArrowUp"]) s.obachan.y -= speed;
        if (keys["ArrowDown"]) s.obachan.y += speed;

        // スティック
        const sensitivity = 1.0;
        s.obachan.x += stick.current.x * speed * sensitivity;
        s.obachan.y += stick.current.y * speed * sensitivity;

        s.obachan.x = Math.max(0, Math.min(WIDTH, s.obachan.x));
        s.obachan.y = Math.max(0, Math.min(HEIGHT, s.obachan.y));

        // ★ 敵が追いかける
        const dx = s.obachan.x - s.enemy.x;
        const dy = s.obachan.y - s.enemy.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d !== 0) {
          s.enemy.x += (2 * dx) / d;
          s.enemy.y += (2 * dy) / d;
        }

        // ★ アイテム取得
        if (dist(s.obachan, s.item) < 20) {
          setScore((prev) => {
            const newScore = prev + 1;
            setMaxScore((m) => Math.max(m, newScore));
            return newScore;
          });

          // アイテム再配置（ランダム）
          s.item.x = Math.random() * (WIDTH - 100) + 50;
          s.item.y = Math.random() * (HEIGHT - 100) + 50;
        }

        // ★ 敵に当たったら終了
        if (dist(s.obachan, s.enemy) < 30) {
          setGameOver(true);
        }
      }

      // 描画
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      // アイテム（黄色）
      ctx.fillStyle = "yellow";
      ctx.beginPath();
      ctx.arc(s.item.x, s.item.y, 8, 0, Math.PI * 2);
      ctx.fill();

      // 敵（赤）
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(s.enemy.x, s.enemy.y, 12, 0, Math.PI * 2);
      ctx.fill();

      // 自キャラ（ピンク）
      ctx.fillStyle = "pink";
      ctx.beginPath();
      ctx.arc(s.obachan.x, s.obachan.y, 6, 0, Math.PI * 2);
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

  // PC マウス操作
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const sensitivity = 0.4;

      stick.current.x = e.movementX * sensitivity;
      stick.current.y = e.movementY * sensitivity;

      clearTimeout((window as any)._mouseTimeout);
      (window as any)._mouseTimeout = setTimeout(() => {
        stick.current = { x: 0, y: 0 };
      }, 50);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      className={`
    w-full min-h-[100dvh] bg-[#080812]
    flex flex-col relative overflow-hidden touch-none overscroll-none
    pt-8 p-4
    border-4 border-violet-300 rounded-2xl shadow-2xl
    ${running && !gameOver ? "md:cursor-none" : "md:cursor-auto"}
  `}
    >
      <div className="fixed top-0 left-0 w-full z-[99999] pointer-events-none">
        <div className="flex justify-center items-center text-white text-xs pt-1 relative">
          <span className="text-base text-violet-300 font-bold">
            スコア: {score}
          </span>

          <span className="text-base text-violet-500 font-bold absolute right-4">
            最大スコア: {maxScore}
          </span>
        </div>
      </div>

      {!running && (
        <button
          onClick={() => {
            const canvas = canvasRef.current;
            if (canvas) reset(canvas.width, canvas.height);
            setRunning(true);
          }}
          className="
  px-6 py-3 bg-pink-400 text-black font-bold rounded-lg shadow-lg active:scale-95
  z-20 absolute
  top-1/2 left-1/2
  -translate-x-1/2 -translate-y-1/2
"
        >
          GAME START
        </button>
      )}

      <canvas ref={canvasRef} className="touch-none flex-1" />

      {gameOver && (
        <button
          onClick={() => {
            const canvas = canvasRef.current;
            if (canvas) reset(canvas.width, canvas.height);
          }}
          className="
  px-6 py-3 bg-white/80 text-black font-bold rounded-lg shadow-lg active:scale-95
  z-20 absolute
  top-1/2 left-1/2
  -translate-x-1/2 -translate-y-1/2
"
        >
          RESET
        </button>
      )}

      <div
        className="
    fixed bottom-6 left-1/2 -translate-x-1/2
    w-32 h-32
    bg-white/10 backdrop-blur-md
    rounded-full border border-white/20
    z-[9999]
    block md:hidden
  "
        onTouchStart={handleStickMove}
        onTouchMove={handleStickMove}
        onTouchEnd={handleStickEnd}
      >
        <div
          id="stick"
          className="
      w-10 h-10 bg-white/40 rounded-full
      absolute top-1/2 left-1/2
      -translate-x-1/2 -translate-y-1/2
    "
        />
      </div>
    </div>
  );
}
