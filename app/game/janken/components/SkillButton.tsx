"use client";

import { playSound } from "@/components/sound/Sound";

type Props = {
  disabled: boolean;
  skillPoints: number;
  onUseSkill: () => void;
};

export function SkillButton({ disabled, skillPoints, onUseSkill }: Props) {
  return (
    <button
      onClick={() => {
        playSound("/sounds/janken/vvv.mp3");
        onUseSkill();
      }}
      disabled={disabled}
      className={`px-6 py-3 rounded-xl font-bold border-4 transition
        ${
          disabled
            ? "bg-gray-400 border-gray-500 text-gray-700"
            : "bg-yellow-300 border-yellow-500 text-black hover:scale-105"
        }
      `}
    >
      必殺技
      <p>スキルポイント: {skillPoints}</p>
    </button>
  );
}
