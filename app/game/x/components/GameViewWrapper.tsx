// @/app/game/x/components/GameViewWrapper.tsx
"use client";

import { useGlobalStore } from "../logic/useGlobalStore";
import { GameLayout } from "./GameLayout";
import { BetSelectionView } from "./BetSelectionView";

interface GameViewWrapperProps {
  gameTitle: string;
  description: string;
  themeColor: "blue" | "purple" | "orange";
  onQuit: () => void;
  onGameStart?: () => void; // ゲーム開始時の追加処理（reset等）
  children: React.ReactNode; // メインゲームのUI
}

export function GameViewWrapper({
  gameTitle,
  description,
  themeColor,
  onQuit,
  onGameStart,
  children,
}: GameViewWrapperProps) {
  const streak = useGlobalStore((s) => s.streak);
  const currentBet = useGlobalStore((s) => s.currentBet);
  const placeBet = useGlobalStore((s) => s.placeBet);

  // BETがまだなら、共通のBetSelectionViewを表示
  if (currentBet === 0) {
    return (
      <GameLayout score={streak} onQuit={onQuit}>
        <BetSelectionView
          gameTitle={gameTitle}
          description={description}
          themeColor={themeColor}
          onPlaceBet={(amount) => {
            placeBet(amount);
            if (onGameStart) onGameStart();
          }}
        />
      </GameLayout>
    );
  }

  // BET済みなら、メインゲームを表示
  return (
    <GameLayout score={streak} onQuit={onQuit}>
      {children}
    </GameLayout>
  );
}
