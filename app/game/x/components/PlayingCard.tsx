// @/components/x/PlayingCard.tsx
import React from "react";

export type Suit = "spades" | "hearts" | "diamonds" | "clubs";

interface PlayingCardProps {
  rank: number;
  suit: Suit;
  className?: string;
  children?: React.ReactNode;
}

export function PlayingCard({
  rank,
  suit,
  className = "",
  children,
}: PlayingCardProps) {
  const getLabel = (n: number) => {
    if (n === 1) return "A";
    if (n === 11) return "J";
    if (n === 12) return "Q";
    if (n === 13) return "K";
    return n.toString();
  };

  const isRed = suit === "hearts" || suit === "diamonds";
  const icon = { spades: "♠", hearts: "♥", diamonds: "♦", clubs: "♣" }[suit];
  const color = isRed ? "text-red-600" : "text-black";
  const label = getLabel(rank);

  return (
    <div
      key={`${rank}-${suit}`}
      /* 修正ポイント1: [container-type:size] を追加 
         これで、子要素が「このカードの幅」を基準にサイズを決められるようになります。
      */
      className={`relative h-full aspect-[2/3] bg-[#fdfdfd] rounded-[7%] border-[1px] border-black/20 shadow-[0_15px_35px_rgba(0,0,0,0.3)] flex items-center justify-center animate-in fade-in zoom-in duration-300 ease-out overflow-hidden text-black font-serif [container-type:size] ${className}`}
    >
      {/* 修正ポイント2: z-indexを調整し、childrenが常に最前面に来るように */}
      <div className="absolute inset-0 z-30 pointer-events-none font-sans">
        {children}
      </div>

      {/* 修正ポイント3: フォントサイズを cqw (Container Query Width) に変更
         18cqw = カードの横幅の18% のサイズ
      */}
      <div
        className={`absolute top-[4%] left-[6%] flex flex-col items-center leading-none ${color} select-none z-10`}
        style={{ fontFamily: "Georgia, serif" }}
      >
        <span className="text-[18cqw] font-bold">{label}</span>
        <span className="text-[12cqw] mt-[2cqw]">{icon}</span>
      </div>

      <div
        className={`absolute bottom-[4%] right-[6%] flex flex-col items-center rotate-180 leading-none ${color} select-none z-10`}
        style={{ fontFamily: "Georgia, serif" }}
      >
        <span className="text-[18cqw] font-bold">{label}</span>
        <span className="text-[12cqw] mt-[2cqw]">{icon}</span>
      </div>

      {/* 中央のメインアイコン/文字 */}
      <div
        className={`flex flex-col items-center justify-center ${color} select-none z-0`}
      >
        {rank > 10 ? (
          <div
            className="flex flex-col items-center"
            style={{ fontFamily: "Georgia, serif" }}
          >
            <span className="text-[45cqw] font-black leading-none">
              {label}
            </span>
            <span className="text-[25cqw] opacity-80 mt-[-5%]">{icon}</span>
          </div>
        ) : (
          /* 数字カードの時はアイコンを大きく */
          <span className="text-[60cqw] drop-shadow-sm leading-none">
            {icon}
          </span>
        )}
      </div>
    </div>
  );
}
