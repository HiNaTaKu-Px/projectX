"use client";

export function CountHeader({
  winCount,
  currentStage,
}: {
  winCount: number;
  currentStage: number;
}) {
  return (
    <div className="fixed top-0 left-0 w-full z-99999 pointer-events-none mt-2">
      <div className="flex justify-center items-center text-white text-xs pt-1 relative">
        <span className="text-base absolute right-4 text-yellow-500 font-bold">
          優勝回数: {winCount}
        </span>
      </div>
    </div>
  );
}
