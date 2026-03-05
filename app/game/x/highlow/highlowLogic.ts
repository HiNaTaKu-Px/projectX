// app/game/x/highlow/highlowLogic.ts
import { KAPLAYCtx } from "kaplay";

export const setupHighLowVisual = (k: KAPLAYCtx) => {
  // 背景シーン
  k.scene("blank", () => {
    k.add([k.rect(k.width(), k.height()), k.color(20, 80, 20)]);
  });

  k.scene("highlow_play", () => {
    // 背景のみ描画
    k.add([k.rect(k.width(), k.height()), k.color(20, 80, 20)]);

    // Reactからの命令：演出だけ担当
    const handleNext = () => {
      // 必要ならここでk.play("sound")など
    };

    const handleGameOver = () => {
      k.shake(12); // ミスした時の画面揺れ演出
    };

    window.addEventListener("game-next", handleNext);
    window.addEventListener("game-over", handleGameOver);

    k.onSceneLeave(() => {
      window.removeEventListener("game-next", handleNext);
      window.removeEventListener("game-over", handleGameOver);
    });
  });
};
