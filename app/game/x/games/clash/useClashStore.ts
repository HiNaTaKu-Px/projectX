"use client";

import { create } from "zustand";
import { Suit } from "@/app/game/x/components/PlayingCard";
import { triggerGameResult } from "../../logic/gameResultHelper";

export type GameStatus = "playing" | "win" | "loss";

interface ClashState {
  playerCard: { num: number; suit: Suit };
  cpuCard: { num: number; suit: Suit };
  isCpuFaceUp: boolean;
  canSwap: boolean;
  gameMsg: string;
  isProcessing: boolean;
  status: GameStatus;
  startRound: () => void;
  swapCard: () => void;
  battle: () => void;
}

const getRandomCard = () => {
  const suits: Suit[] = ["spades", "hearts", "diamonds", "clubs"];
  return {
    num: Math.floor(Math.random() * 13) + 1,
    suit: suits[Math.floor(Math.random() * suits.length)],
  };
};

export const useClashStore = create<ClashState>((set, get) => ({
  playerCard: getRandomCard(),
  cpuCard: getRandomCard(),
  isCpuFaceUp: false,
  canSwap: true,
  gameMsg: "BATTLE OR SWAP?",
  isProcessing: false,
  status: "playing",

  startRound: () =>
    set({
      playerCard: getRandomCard(),
      cpuCard: getRandomCard(),
      isCpuFaceUp: false,
      canSwap: true,
      gameMsg: "WATCH THE SUIT...",
      isProcessing: false,
      status: "playing",
    }),

  swapCard: () => {
    if (!get().canSwap || get().isProcessing) return;
    set({ playerCard: getRandomCard(), canSwap: false, gameMsg: "SWAPPED!" });
  },

  battle: () => {
    if (get().isProcessing) return;

    set({ isProcessing: true, isCpuFaceUp: true });

    const isWin = get().playerCard.num >= get().cpuCard.num;
    set({ gameMsg: isWin ? "WINNER!" : "LOSER..." });

    // ★ 修正: status をセットすると同時に isProcessing を false に戻す
    triggerGameResult(isWin, 2.0, (status) => {
      set({ status, isProcessing: false });
    });
  },
}));
