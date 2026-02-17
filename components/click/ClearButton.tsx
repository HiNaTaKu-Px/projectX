export function ClearButton({
  safeCoins,
  onClear,
}: {
  safeCoins: number;
  onClear: () => void;
}) {
  return (
    <button
      onClick={onClear}
      className={`
    w-full
    col-span-3 py-5 px-5 text-white text-xl font-extrabold
    shadow-xl hover:scale-110 transition
    ${
      safeCoins >= 100000
        ? "bg-[linear-gradient(90deg,red,#ff7f00,yellow,#00ff00,#00ffff,#0000ff,#8b00ff)]"
        : "bg-gray-600"
    }
  `}
      style={{ opacity: Math.min(safeCoins / 100000, 1) }}
      disabled={safeCoins < 100000}
    >
      CLEAR
    </button>
  );
}
