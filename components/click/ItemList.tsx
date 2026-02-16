"use client";

import { useEffect, useRef } from "react";

type ItemListProps = {
  sortedItems: [string, number][];
  onUseItem: (name: string) => void;
  onUseAll: () => void;
};

export function ItemList({ sortedItems, onUseItem, onUseAll }: ItemListProps) {
  const clickSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // SSR 回避
    if (typeof window === "undefined") return;

    clickSound.current = new Audio("/sounds/click/click.mp3");
  }, []);

  const playSound = () => {
    if (clickSound.current) {
      clickSound.current.currentTime = 0;
      clickSound.current.play().catch(() => {});
    }
  };

  return (
    <div className="mb-4 border p-3 rounded bg-white/70 backdrop-blur max-w-sm mx-auto shadow space-y-4 text-gray-800 min-h-60">
      <div className="text-center mb-2">
        <div className="inline-block">
          <p className="font-bold text-sm inline-block">🎒 所持アイテム</p>
          <div className="h-px bg-gray-500/50 mt-1" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {sortedItems.map(([name, count]) => (
          <div
            key={name}
            className="flex flex-col items-center p-1 bg-white rounded shadow-sm"
          >
            <span className="text-xs mb-1">
              {name} ×{count}
            </span>

            <button
              onClick={() => {
                playSound();
                onUseItem(name);
              }}
              className="bg-indigo-500 text-white text-[10px] px-2 py-0.5 hover:scale-105 transition rounded"
            >
              使用
            </button>
          </div>
        ))}
      </div>

      {sortedItems.length > 0 && (
        <div className="flex justify-center pt-2">
          <button
            onClick={() => {
              playSound();
              onUseAll();
            }}
            className="w-28 h-9 bg-red-600 text-white font-bold hover:scale-105 transition text-xs rounded"
          >
            全使用
          </button>
        </div>
      )}
    </div>
  );
}
