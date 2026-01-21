"use client";

import Link from "next/link";

export default function Help() {
  return (
    <main className="min-h-screen bg-white text-gray-800 p-6 space-y-6">
      <h2 className="text-3xl font-bold text-center">📘 説明書</h2>

      <div className="text-center">
        <Link href="/">
          <button className="mt-4 bg-gray-500 text-white px-4 py-2 rounded">戻る</button>
        </Link>
      </div>

      <div className="border p-4 rounded bg-gray-100 max-w-md mx-auto">
        <h3 className="text-xl font-semibold mb-2">ゲームの遊び方</h3>
        <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
          <li>「クリック！」ボタンを押すとコインが増える</li>
          <li>ショップでアイテムを購入できる</li>
          <li>ガチャを回してアイテムを入手できる（1プレイ500コイン）</li>
          <li>背景変更ボタンでテーマを切り替えられる</li>
          <li>オール使用でアイテムをまとめて使える</li>
        </ul>
      </div>
    </main>
  );
}
