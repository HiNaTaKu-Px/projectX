"use client";

type Props = {
  resultState: "win" | "lose";
  onHome: () => void;
  onReset: () => void;
};

export function ResultButtons({ resultState, onHome, onReset }: Props) {
  return (
    <div className="flex flex-row gap-6">
      {resultState === "win" && (
        <button
          onClick={onHome}
          className="px-7 py-3 bg-green-400 rounded-xl font-bold hover:scale-105 transition"
        >
          ホーム
        </button>
      )}

      {resultState === "lose" && (
        <button
          onClick={onReset}
          className="px-6 py-3 bg-pink-300 rounded-xl font-bold text-black hover:scale-105 transition"
        >
          リセット
        </button>
      )}
    </div>
  );
}
