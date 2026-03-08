"use client";

import { create } from "zustand";
import { triggerGameResult } from "../../logic/gameResultHelper";

export type Suit = "spades" | "hearts" | "diamonds" | "clubs";
export type GameStatus = "playing" | "win" | "loss";

interface HighLowState {
  currentNum: number;
  currentSuit: Suit;
  gameMsg: string;
  isProcessing: boolean;
  status: GameStatus;
  handleGuess: (type: "high" | "low") => void;
  resetGame: () => void;
}

const getRandomSuit = (): Suit => {
  const suits: Suit[] = ["spades", "hearts", "diamonds", "clubs"];
  return suits[Math.floor(Math.random() * suits.length)];
};

export const useHighLowStore = create<HighLowState>((set, get) => ({
  currentNum: Math.floor(Math.random() * 13) + 1,
  currentSuit: getRandomSuit(),
  gameMsg: "HIGH OR LOW?",
  isProcessing: false,
  status: "playing",

  resetGame: () => {
    set({
      currentNum: Math.floor(Math.random() * 13) + 1,
      currentSuit: getRandomSuit(),
      gameMsg: "HIGH OR LOW?",
      isProcessing: false,
      status: "playing",
    });
  },

  handleGuess: (type) => {
    if (get().isProcessing) return;
    set({ isProcessing: true });

    const nextNum = Math.floor(Math.random() * 13) + 1;
    const nextSuit = getRandomSuit();

    const isWin =
      type === "high"
        ? nextNum >= get().currentNum
        : nextNum <= get().currentNum;

    set({
      currentNum: nextNum,
      currentSuit: nextSuit,
      gameMsg: isWin ? "WINNER!" : "LOSER...",
    });

    // ★ 修正: status と共に isProcessing を false に戻す
    triggerGameResult(isWin, 2.0, (status) => {
      set({ status, isProcessing: false });
    });
  },
}));
