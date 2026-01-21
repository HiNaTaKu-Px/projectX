"use client";

import { useState } from "react";
import Link from "next/link";

export default function Shop() {
  const [coins, setCoins] = useState(1000); // 仮の初期値
  const [shopMessage, setShopMessage] = useState("");
  const [inventory, setInventory] = useState<{ [name: string]: number }>({});

  const items = [
    { name: "パワーアップ", cost: 100 },
    { name: "スピードブースト", cost: 200 },
    { name: "ラッキーアイテム", cost: 500 },
  ];

  const buyItem = (item: { name: string; cost: number }) => {
    if (coins >= item.cost) {
      setCoins((prev) => prev - item.cost);
      setInventory((prev) => ({
        ...prev,
        [item.name]: (prev[item.name] || 0) + 1,
      }));
      setShopMessage(`${item.name} を購入しました！`);
    } else {
      setShopMessage("コインが足りません！");
    }
  };

  return (
    <main className="min-h-screen bg-white text-gray-800 p-6 space-y-6">
      <h2 className="text-3xl font-bold text-center">🛒 ショップ</h2>

      <div className="text-center">
        <p>コイン: <span className="font-bold">{coins}</span></p>
      </div>

      <div className="text-center">
        <Link href="/">
          <button className="mt-4 bg-gray-500 text-white px-4 py-2 rounded">戻る</button>
        </Link>
      </div>

      <div className="border p-4 rounded bg-gray-100 max-w-md mx-auto">
        <h3 className="text-xl font-semibold mb-2">ショップ商品</h3>
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.name} className="flex justify-between items-center">
              <span>{item.name} - {item.cost}コイン</span>
              <button
                className="bg-green-500 text-white px-3 py-1 rounded"
                onClick={() => buyItem(item)}
              >
                購入
              </button>
            </li>
          ))}
        </ul>
      </div>

      {shopMessage && (
        <div className="text-center text-blue-600 font-semibold">
          {shopMessage}
        </div>
      )}

      <div className="border p-4 rounded bg-white max-w-md mx-auto">
        <h4 className="font-bold mb-2">所持アイテム</h4>
        <ul className="list-disc list-inside text-sm text-gray-700">
          {Object.entries(inventory).length === 0 ? (
            <li>なし</li>
          ) : (
            Object.entries(inventory).map(([name, count]) => (
              <li key={name}>
                {name} × {count}
              </li>
            ))
          )}
        </ul>
      </div>
    </main>
  );
}
