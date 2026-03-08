// @/store/useGlobalStore.ts
import { create } from "zustand";

export type GameType = "none" | "highlow" | "clash" | "bj";

// ★ 修正1: 不要な項目を完全に削除してスッキリさせる
export interface Avatar {
  mode: "image"; // "color" はもう使わないので固定
  image: string; // "1", "2", "3" の数字のみが入る
}

interface GlobalState {
  streak: number;
  coins: number;
  currentBet: number;
  activeGame: GameType;
  gameBestScores: Record<string, number>;

  // アバターの状態
  avatar: Avatar;

  // アクション
  addStreak: () => void;
  resetStreak: () => void;
  setGame: (game: GameType) => void;
  // DBからの同期（avatarDataも受け取れるように！）
  syncData: (
    coins: number,
    scores: { game: string; value: number }[],
    avatarData?: Partial<Avatar>,
  ) => void;
  placeBet: (amount: number) => boolean;
  resolveWin: (multiplier: number) => void;
  resolveLoss: () => void;

  // アバターを変更するアクション
  setAvatar: (newAvatar: Avatar) => void;
}

export const useGlobalStore = create<GlobalState>((set, get) => ({
  streak: 0,
  coins: 0,
  currentBet: 0,
  activeGame: "none",
  gameBestScores: {
    highlow: 0,
    clash: 0,
    bj: 0,
  },

  // ★ 修正2: 初期値からも古い項目を削除
  avatar: {
    mode: "image",
    image: "1", // 最初は ID "1" (ラビィ)
  },

  addStreak: () =>
    set((s) => {
      if (s.activeGame === "none") return {};
      const newStreak = s.streak + 1;
      const currentBest = s.gameBestScores[s.activeGame] || 0;
      const isNewRecord = newStreak > currentBest;

      return {
        streak: newStreak,
        gameBestScores: {
          ...s.gameBestScores,
          [s.activeGame]: isNewRecord ? newStreak : currentBest,
        },
      };
    }),

  resetStreak: () => set({ streak: 0 }),

  setGame: (game) =>
    set({
      activeGame: game,
      streak: 0,
    }),

  syncData: (coins, scoresList, avatarData) => {
    const scoresMap: Record<string, number> = {
      highlow: 0,
      clash: 0,
      bj: 0,
    };
    scoresList.forEach((s) => {
      scoresMap[s.game] = s.value;
    });

    set((state) => ({
      coins,
      gameBestScores: scoresMap,
      // DBにアバター情報があれば合体させる
      avatar: avatarData ? { ...state.avatar, ...avatarData } : state.avatar,
    }));
  },

  placeBet: (amount) => {
    const { coins } = get();
    if (coins < amount) return false;

    set((s) => ({
      coins: s.coins - amount,
      currentBet: amount,
    }));
    return true;
  },

  resolveWin: (multiplier) => {
    const { currentBet, coins } = get();
    const payout = Math.floor(currentBet * multiplier);

    set({
      coins: coins + payout,
      currentBet: 0,
    });
  },

  resolveLoss: () => {
    set({
      currentBet: 0,
      streak: 0,
    });
  },

  setAvatar: (newAvatar: Avatar) => set({ avatar: newAvatar }),
}));
