"use client";

export function StartButton({ onStart }: { onStart: () => void }) {
  return (
    <button
      onClick={onStart}
      className="
        px-6 py-3 bg-pink-400 text-black font-bold rounded-lg shadow-lg active:scale-95
        z-20 absolute
        top-1/2 left-1/2
        -translate-x-1/2 -translate-y-1/2
      "
    >
      GAME START
    </button>
  );
}
