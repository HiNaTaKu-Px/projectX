// @/app/game/x/components/MenuView.tsx
"use client";

interface MenuViewProps {
  coins: number;
  gameBestScores: Record<string, number>;
  onSelect: (game: "highlow" | "clash" | "bj") => void;
  onExit: () => void;
  isSaving: boolean;
}

export function MenuView({
  coins,
  gameBestScores,
  onSelect,
  onExit,
  isSaving,
}: MenuViewProps) {
  const games = [
    {
      id: "highlow",
      label: "HIGH & LOW",
      color:
        "border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)] bg-blue-950/40 hover:bg-blue-600/60",
    },
    {
      id: "clash",
      label: "CARD CLASH",
      color:
        "border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)] bg-purple-950/40 hover:bg-purple-600/60",
    },
    {
      id: "bj",
      label: "BLACKJACK 21",
      color:
        "border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)] bg-orange-950/40 hover:bg-orange-600/60",
    },
  ] as const;

  return (
    <div className="flex-1 flex flex-col items-center justify-center pointer-events-auto gap-6 w-full max-w-sm px-6">
      {/* 1. コイン表示：絵文字を使わず、SVGアイコンで確実に表示 */}
      <div className="flex flex-col items-center">
        <p className="text-[10px] font-black tracking-[0.4em] text-yellow-500/80 uppercase mb-2">
          Total Balance
        </p>
        <div className="relative flex items-center gap-4 px-8 py-3 bg-black/60 border-2 border-yellow-400/50 rounded-2xl backdrop-blur-xl shadow-[0_0_30px_rgba(234,179,8,0.15)]">
          {/* コインアイコン (SVGで描画することでOSに依存せず表示) */}
          <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(234,179,8,0.8)] border border-yellow-200">
            <span className="text-yellow-900 font-black text-lg">C</span>
          </div>

          <span className="text-4xl font-black text-white tabular-nums tracking-tighter drop-shadow-md">
            {coins.toLocaleString()}
          </span>
        </div>
      </div>

      <h2 className="text-xs font-bold tracking-[0.5em] mt-4 mb-1 uppercase opacity-40 text-white italic">
        — Select Mission —
      </h2>

      {/* 2. ゲーム選択ボタン */}
      <div className="grid w-full gap-3">
        {games.map((game) => (
          <button
            key={game.id}
            onClick={() => onSelect(game.id)}
            className={`w-full py-5 border-4 rounded-3xl text-2xl font-black transition-all active:scale-95 group relative overflow-hidden ${game.color}`}
          >
            <div className="flex flex-col relative z-10 text-white">
              <span className="tracking-tighter">{game.label}</span>
              <span className="text-[10px] font-bold opacity-60 tracking-widest mt-1">
                BEST RECORD: {gameBestScores[game.id] || 0}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* 3. 終了ボタン */}
      <button
        onClick={onExit}
        disabled={isSaving}
        className="w-full py-3 bg-red-950/30 hover:bg-red-900/40 rounded-xl text-[10px] font-bold mt-4 border border-red-500/30 transition-all text-red-400 tracking-[0.3em] uppercase disabled:opacity-30"
      >
        {isSaving ? "Saving..." : "Exit to Home"}
      </button>

      {/* Windowsでの文字のにじみを防ぐ設定 */}
      <style jsx global>{`
        body {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `}</style>
    </div>
  );
}
