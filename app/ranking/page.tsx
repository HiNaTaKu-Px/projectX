"use client";

import { useEffect, useState } from "react";

export default function RankingPage() {
  const [ranking, setRanking] = useState<any>(null);

  useEffect(() => {
    const fetchRanking = async () => {
      const res = await fetch("/api/ranking");
      const data = await res.json();
      setRanking(data);
    };
    fetchRanking();
  }, []);

  if (!ranking) return <p className="text-center mt-10">読み込み中...</p>;

  // ゲーム名
  const gameLabels = {
    click: "クリック",
    janken: "ジャンケン",
    hockey: "ホッケー",
    escape: "エスケープ",
  } as const;

  // ★ 右側に表示する説明ラベル
  const valueLabels = {
    click: "コイン数",
    janken: "優勝回数",
    hockey: "最大スコア",
    escape: "最大スコア",
  } as const;

  type GameKey = keyof typeof gameLabels;

  // 🥇🥈🥉 を返す関数
  const medal = (rank: number) => {
    if (rank === 0) return "🥇";
    if (rank === 1) return "🥈";
    if (rank === 2) return "🥉";
    return "";
  };

  return (
    <main className="mt-10 p-4 max-w-xl mx-auto space-y-6">
      <h1 className="text-4xl font-bold text-center">ランキング</h1>

      {(Object.keys(gameLabels) as GameKey[]).map((key) => (
        <div key={key} className="p-4 border rounded-xl shadow bg-white">
          {/* ★ タイトル左・説明ラベル右 */}
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-bold">{gameLabels[key]}</h2>
            <span className="text-gray-600 text-sm font-semibold">
              （{valueLabels[key]}）
            </span>
          </div>

          {(!ranking[key] || ranking[key].length === 0) && (
            <p className="text-gray-500">まだスコアがありません</p>
          )}

          {ranking[key]?.map((item: any, i: number) => (
            <div
              key={i}
              className="flex justify-between border-b py-1 text-lg font-bold"
            >
              <span>
                {medal(i)} {i + 1} 位
              </span>
              <span>{item.email ?? "名無し"}</span>
              <span>{item.value}</span>
            </div>
          ))}
        </div>
      ))}
    </main>
  );
}
