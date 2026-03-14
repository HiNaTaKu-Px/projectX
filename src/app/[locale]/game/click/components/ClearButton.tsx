"use client";

import { useState } from "react";

export function ClearButton({
  safeCoins,
  onClear,
}: {
  safeCoins: number;
  onClear: () => void;
}) {
  // ★ 1秒間の連打防止用のステート
  const [isWaiting, setIsWaiting] = useState(false);

  const handleClick = () => {
    // すでに待機中、またはコインが足りない場合は何もしない
    if (isWaiting || safeCoins < 100000) return;

    // 親コンポーネントのクリア処理を実行
    onClear();

    // ★ 1秒間だけボタンを無効化する
    setIsWaiting(true);
    setTimeout(() => {
      setIsWaiting(false);
    }, 1000);
  };

  return (
    <button
      onClick={handleClick}
      // ★ コイン不足、または1秒間の待機中なら disabled にする
      disabled={safeCoins < 100000 || isWaiting}
      className={`
        w-full
        col-span-3 py-5 px-5 text-white text-xl font-extrabold
        shadow-xl transition
        ${
          // 待機中かコイン不足なら少し暗く、そうでなければ虹色 or グレー
          isWaiting || safeCoins < 100000
            ? "bg-gray-600 opacity-50 cursor-not-allowed"
            : "bg-[linear-gradient(90deg,red,#ff7f00,yellow,#00ff00,#00ffff,#0000ff,#8b00ff)] hover:scale-110 active:scale-95"
        }
      `}
      style={{
        // コイン数に応じた透明度は維持（待機中は0.5固定にするなど調整可）
        opacity: isWaiting ? 0.5 : Math.min(safeCoins / 100000, 1),
      }}
    >
      {isWaiting ? "PLEASE WAIT..." : "CLEAR"}
    </button>
  );
}