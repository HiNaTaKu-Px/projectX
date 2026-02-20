"use client";

export function ResetButton({
  onReset,
  onBack,
}: {
  onReset: () => void;
  onBack: () => void;
}) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-50 gap-8 translate-y-28">
      <button
        onClick={onReset}
        className="px-6 py-3 bg-yellow-300 text-black font-bold rounded-lg shadow-lg active:scale-95"
      >
        リセット
      </button>

      <button
        onClick={onBack}
        className="px-6 py-3 bg-gray-300 text-black font-bold rounded-lg shadow-lg active:scale-95"
      >
        ホーム
      </button>
    </div>
  );
}
