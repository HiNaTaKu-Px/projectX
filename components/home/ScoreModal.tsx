"use client";

export function ScoreModal({
  scores,
  onClose,
}: {
  scores: any[];
  onClose: () => void;
}) {
  const gameNames: Record<string, string> = {
    click: "クリック",
    janken_wins: "ジャンケン",
    hockey: "ホッケー",
    escape: "エスケープ",
  };

  const gameDesc: Record<string, string> = {
    click: "(コイン数)",
    janken_wins: "(優勝回数)",
    hockey: "(最大スコア)",
    escape: "(最大スコア)",
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-80 text-center space-y-4">
        <h2 className="text-xl font-bold text-green-700">スコア一覧</h2>

        {scores.length === 0 && (
          <p className="text-gray-500 text-sm">スコアがありません</p>
        )}

        {/* ★ 縦を大きくした部分 */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {scores.map((s) => (
            <div key={s.id} className="p-2 border rounded-lg bg-gray-50">
              {/* 1行目：左タイトル / 右説明 */}
              <div className="flex justify-between items-center">
                <p className="font-bold text-left">
                  {gameNames[s.game] ?? s.game}
                </p>
                <p className="text-sm text-gray-600 text-right">
                  {gameDesc[s.game] ?? ""}
                </p>
              </div>

              {/* 2行目：右にスコア */}
              <p className="text-right text-lg font-bold text-green-700 mt-1">
                {s.value}
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 bg-gray-300 rounded font-bold shadow hover:bg-gray-400 transition"
        >
          閉じる
        </button>
      </div>
    </div>
  );
}
