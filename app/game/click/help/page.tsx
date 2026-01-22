"use client";

import Link from "next/link";
import * as Tone from "tone";

export default function Help() {
  // 電子音
  const playSound = async () => {
    await Tone.start();
    const synth = new Tone.Synth().toDestination();
    synth.triggerAttackRelease("C6", "32n"); // 短いクリック音
  };

  return (
    <main className="min-h-screen bg-white text-gray-800 p-6 space-y-6">
      <h2 className="text-3xl font-bold text-center">📘 説明書</h2>

      {/* 戻るボタン */}
      <div className="text-center">
        <Link href="/">
          <button className="btn btn-neutral mt-4" onClick={playSound}>
            戻る
          </button>
        </Link>
      </div>

      {/* 説明書内容 */}
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
