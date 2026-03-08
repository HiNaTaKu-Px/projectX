"use client";

export function ScoreHeader({
  score,
  maxScore,
}: {
  score: number;
  maxScore: number;
}) {
  return (
    <div className="fixed top-0 left-0 w-full z-[99999] pointer-events-none">
      <div className="flex justify-center items-center text-white text-xs pt-1 relative">
        <span className="text-base text-violet-300 font-bold">
          スコア: {score}
        </span>

        <span className="text-base text-violet-500 font-bold absolute right-4">
          最大スコア: {maxScore}
        </span>
      </div>
    </div>
  );
}
