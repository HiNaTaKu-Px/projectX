"use client";

import { playSound } from "@/components/sound/Sound";

type Props = {
  disabled: boolean;
  onPlay: (hand: string) => void;
};

const hands = ["✊", "✌️", "🖐️"];

export function JankenButtons({ disabled, onPlay }: Props) {
  return (
    <div className="flex gap-5 justify-center mt-4">
      {hands.map((h) => (
        <button
          key={h}
          disabled={disabled}
          onClick={() => {
            playSound("/sounds/janken/pon.mp3");
            onPlay(h);
          }}
          className={`text-6xl p-3 rounded-full border-2 transition
            ${
              disabled
                ? "bg-gray-600 border-gray-400 opacity-50 cursor-not-allowed"
                : "bg-gray-800 border-pink-500 hover:scale-125"
            }
          `}
        >
          {h}
        </button>
      ))}
    </div>
  );
}
