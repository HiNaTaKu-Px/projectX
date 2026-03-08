export function StartButton({ onStart }: { onStart: () => void }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-50">
      <button
        onClick={onStart}
        className="px-6 py-3 bg-cyan-400 text-black font-bold rounded-lg shadow-lg active:scale-95 -mt-6"
      >
        GAME START
      </button>
    </div>
  );
}
