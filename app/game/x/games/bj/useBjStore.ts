"use client";

import { create } from "zustand";
import { Suit } from "@/app/game/x/components/PlayingCard";
import { triggerGameResult } from "../../logic/gameResultHelper";

interface Card {
  num: number;
  suit: Suit;
}

interface BjState {
  hand: Card[];
  total: number;
  status: "playing" | "bust" | "stand" | "loss" | "win";
  isProcessing: boolean;
  drawCard: () => void;
  stand: () => void;
  resetGame: () => void;
}

export const useBjStore = create<BjState>((set, get) => ({
  hand: [],
  total: 0,
  status: "playing",
  isProcessing: false,

  resetGame: () =>
    set({ hand: [], total: 0, status: "playing", isProcessing: false }),

  // @/app/game/x/games/bj/useBjStore.ts

  drawCard: () => {
    const { status, hand, total, isProcessing } = get();
    if (status !== "playing" || isProcessing) return;

    const num = Math.floor(Math.random() * 13) + 1;
    const suit = (["spades", "hearts", "diamonds", "clubs"] as Suit[])[
      Math.floor(Math.random() * 4)
    ];
    const newCard = { num, suit };

    const val = num > 10 ? 10 : num;
    const newTotal = total + val;
    const newHand = [...hand, newCard];

    if (newTotal > 21) {
      // ★修正：status: "bust" をここでセットしない！
      // 代わりに isProcessing を true にして入力をロックするだけにする
      set({
        hand: newHand,
        total: newTotal,
        isProcessing: true,
      });

      // ★ Helperに任せることで、2秒後の setTimeout 内で status が "loss" に更新される
      triggerGameResult(false, 0, (status) => set({ status }));
    } else {
      set({ hand: newHand, total: newTotal });
    }
  },
  stand: () => {
    const { total, status, isProcessing } = get();
    if (status !== "playing" || total === 0 || isProcessing) return;

    set({ isProcessing: true });

    // 17以上21以下なら勝利、それ以外は敗北
    const isWin = total >= 17 && total <= 21;

    // 倍率の決定 (ブラックジャックなら3倍、それ以外なら2倍)
    const multiplier = total === 21 ? 3.0 : 2.0;

    // ★ 判定結果と倍率を渡してヘルパーを起動
    triggerGameResult(isWin, multiplier, (status) => set({ status }));
  },
}));
