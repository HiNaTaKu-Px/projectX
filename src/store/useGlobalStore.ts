// @/store/useGlobalStore.ts
import { create } from "zustand";
import { updateAvatarAction } from "./actions"; // 後述するアクションをインポート

export type GameType = "none" | "highlow" | "clash" | "bj";

export interface Avatar {
  mode: "image"; 
  image: string; // "1", "2", "3" など
}

interface GlobalState {
  streak: number;
  coins: number;
  currentBet: number;
  activeGame: GameType;
  gameBestScores: Record<string, number>;
  avatar: Avatar;

  // アクション
  addStreak: () => void;
  resetStreak: () => void;
  setGame: (game: GameType) => void;
  syncData: (
    coins: number,
    scores: { game: string; value: number }[],
    avatarData?: Partial<Avatar>,
  ) => void;
  placeBet: (amount: number) => boolean;
  resolveWin: (multiplier: number) => void;
  resolveLoss: () => void;

  // ★ 修正: DB連携を含めたアバター変更
  setAvatar: (newAvatar: Avatar) => Promise<void>;
}

export const useGlobalStore = create<GlobalState>((set, get) => ({
  streak: 0,
  coins: 0,
  currentBet: 0,
  activeGame: "none",
  gameBestScores: { highlow: 0, clash: 0, bj: 0 },
  avatar: {
    mode: "image",
    image: "1", 
  },

  // スコア加算
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

  setGame: (game) => set({ activeGame: game, streak: 0 }),

  // DBからのデータ同期
  syncData: (coins, scoresList, avatarData) => {
    const scoresMap: Record<string, number> = { highlow: 0, clash: 0, bj: 0 };
    scoresList.forEach((s) => { scoresMap[s.game] = s.value; });

    set((state) => ({
      coins,
      gameBestScores: scoresMap,
      avatar: avatarData ? { ...state.avatar, ...avatarData } : state.avatar,
    }));
  },

  placeBet: (amount) => {
    const { coins } = get();
    if (coins < amount) return false;
    set((s) => ({ coins: s.coins - amount, currentBet: amount }));
    return true;
  },

  resolveWin: (multiplier) => {
    const { currentBet, coins } = get();
    const payout = Math.floor(currentBet * multiplier);
    set({ coins: coins + payout, currentBet: 0 });
  },

  resolveLoss: () => set({ currentBet: 0, streak: 0 }),

  // ★ 全修正: 画面更新後にDBへ保存
  setAvatar: async (newAvatar: Avatar) => {
    // 1. まず UI 上の表示を即座に変更（サクサク感を出す）
    set({ avatar: newAvatar });

    // 2. サーバーアクションを叩いて DB を永続化
    try {
      const result = await updateAvatarAction(newAvatar.image);
      if (!result.success) {
        console.error("DBの更新に失敗しました");
        // 必要であれば、ここで元の状態に戻す処理を追加
      }
    } catch (error) {
      console.error("通信エラー:", error);
    }
  },
}));