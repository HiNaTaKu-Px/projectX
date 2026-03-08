// @/app/game/x/setupGameVisual.ts
import { KAPLAYCtx } from "kaplay";

export const setupGameVisual = (k: KAPLAYCtx) => {
  const BG_COLOR = k.rgb(20, 80, 20);

  k.scene("blank", () => {
    k.add([k.rect(k.width(), k.height()), k.color(BG_COLOR)]);
  });

  k.scene("game_active", () => {
    k.add([k.rect(k.width(), k.height()), k.color(BG_COLOR)]);

    const triggerVisual = (isWin: boolean) => {
      // KAPLAYでは「画面の揺れ」と「パーティクル」だけ担当
      k.shake(isWin ? 10 : 30);

      const particleCount = isWin ? 50 : 30;
      for (let i = 0; i < particleCount; i++) {
        const p = k.add([
          k.pos(k.center()),
          isWin
            ? k.circle(k.rand(4, 8))
            : k.rect(k.rand(10, 20), k.rand(10, 20)),
          k.color(isWin ? k.rgb(255, 255, 0) : k.rgb(200, 0, 0)),
          k.move(k.rand(0, 360), k.rand(200, 800)),
          k.opacity(1),
          k.anchor("center"),
        ]);
        p.onUpdate(() => {
          p.opacity -= k.dt() * 1.5;
          if (p.opacity <= 0) p.destroy();
        });
      }
    };

    const handleVisualEffect = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (!detail) return;
      triggerVisual(detail.type === "win");
    };

    window.addEventListener("game-visual-effect", handleVisualEffect);
    k.onSceneLeave(() =>
      window.removeEventListener("game-visual-effect", handleVisualEffect),
    );
  });
};
