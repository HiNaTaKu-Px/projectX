// app/game/x/highlow/HighLowEffect.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Application, Sprite, Texture } from "pixi.js";

export function HighLowEffect() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const appRef = useRef<Application | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    let isDestroyed = false;

    const handleEffect = (e: any) => {
      const app = appRef.current;
      if (!app || !app.stage || isDestroyed) return;

      const { type } = e.detail;
      const isWin = type === "win";
      const particleCount = isWin ? 50 : 25;
      const tint = isWin ? 0xffd700 : 0xff4b2b;

      for (let i = 0; i < particleCount; i++) {
        const p = new Sprite(Texture.WHITE);
        p.width = p.height = Math.random() * 15 + 10;
        p.tint = tint;
        p.anchor.set(0.5);
        p.x = app.screen.width / 2;
        p.y = app.screen.height / 2;
        app.stage.addChild(p);

        const angle = Math.random() * Math.PI * 2;
        const speed = isWin ? Math.random() * 15 + 5 : Math.random() * 8 + 3;
        let vx = Math.cos(angle) * speed;
        let vy = Math.sin(angle) * speed;
        let life = 1.0;

        const tickerCb = (ticker: any) => {
          if (isDestroyed || !p.parent) return;
          p.x += vx * ticker.deltaTime;
          p.y += vy * ticker.deltaTime;
          if (isWin) vy += 0.4 * ticker.deltaTime;
          life -= 0.02 * ticker.deltaTime;
          p.alpha = life;
          if (life <= 0) {
            app.ticker.remove(tickerCb);
            p.destroy();
          }
        };
        app.ticker.add(tickerCb);
      }
    };

    const init = async () => {
      if (!canvasRef.current || appRef.current) return;
      const app = new Application();
      try {
        await app.init({
          canvas: canvasRef.current,
          resizeTo: window,
          backgroundAlpha: 0,
          antialias: true,
          preference: "webgl",
        });

        if (isDestroyed) {
          app.destroy(true);
          return;
        }

        appRef.current = app;
        window.addEventListener("game-visual-effect", handleEffect);
      } catch (err) {
        console.error("PixiJS Init Error:", err);
      }
    };

    init();

    return () => {
      isDestroyed = true;
      window.removeEventListener("game-visual-effect", handleEffect);
      if (appRef.current) {
        appRef.current.destroy(true, { children: true });
        appRef.current = null;
      }
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 9999, display: "block" }}
    />
  );
}
