// @/app/game/x/logic/gameResultHelper.ts

/**
 * ゲームの勝敗が決まった後の共通演出・状態管理ヘルパー
 * @param isWin 勝利フラグ
 * @param multiplier 倍率 (3.0, 2.0など)
 * @param setStatus Storeのステータスを更新し、倍率を伝播させるコールバック
 */
export const triggerGameResult = (
  isWin: boolean,
  multiplier: number,
  setStatus: (status: "win" | "loss", m: number) => void,
) => {
  // 1. 演出イベントを発火 (KAPLAYやオーバーレイが反応)
  window.dispatchEvent(
    new CustomEvent("game-visual-effect", {
      detail: { type: isWin ? "win" : "lose" },
    }),
  );

  // 2. 2秒後にアバター表示フラグを立てる
  // ここで初めて status を変更することで、UI側の useEffect が発火し
  // GamePageClient の handleGameOver が呼ばれる流れになります。
  setTimeout(() => {
    // 勝利時は引数の倍率を、敗北時は 0 をセット
    setStatus(isWin ? "win" : "loss", isWin ? multiplier : 0);
  }, 2000);
};
