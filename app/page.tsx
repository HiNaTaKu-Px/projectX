"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Home() {
  const [showResetModal, setShowResetModal] = useState(false);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8 space-y-12">
      <h1 className="text-5xl font-extrabold">ゲーム選択</h1>
      {/* ゲーム選択ボタン */}
      <div className="space-y-6">
        <Button
          asChild
          className="text-3xl px-12 py-8 bg-blue-600 text-white font-bold hover:scale-105 transition"
        >
          <Link href="/game/click">クリックゲーム</Link>
        </Button>

        <Button
          asChild
          className="text-3xl px-12 py-8 bg-pink-600 text-white font-bold hover:scale-105 transition"
        >
          <Link href="/game/janken">じゃんけんトーナメント</Link>
        </Button>
      </div>
      {/* 説明書 */}
      <section className="max-w-xl text-center bg-white p-6 rounded shadow space-y-4">
        <h2 className="text-2xl font-bold">📘 各ゲームの遊び方</h2>

        <div className="text-left text-gray-700 space-y-4">
          <div>
            <h3 className="font-bold text-lg text-blue-600 text-center">
              ▶ クリックゲーム ◀
            </h3>
            <ul className="list-disc list-inside space-y-1">
              <li>「クリック」ボタンを押すとコインが増えます</li>
              <li>ガチャでアイテムを入手できます（1回500コイン）</li>
              <li>背景変更ボタンでテーマを切り替えられます</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg text-pink-600 text-center">
              ▶ じゃんけんゲーム ◀
            </h3>
            <ul className="list-disc list-inside space-y-1">
              <li>CPUとじゃんけんで3勝すると勝ち上がります</li>
              <li>3ステージ勝ち抜くと優勝！</li>
              <li>必殺技ボタンで1回だけ即勝利できます</li>
              <li>トーナメント表や演出も楽しんでね！</li>
            </ul>
            <h3 className="font-bold text-lg text-red-600 text-center">
              ▶ 共通 ◀
            </h3>
            <ul className="list-disc list-inside space-y-1">
              <li>スクロールで一番上に行くとホームボタン表示</li>
              <li>データ消去ボタンで初期化</li>
            </ul>
          </div>
        </div>
      </section>
      <section className="max-w-xl bg-white p-6 rounded shadow space-y-4">
        <h2 className="text-2xl font-bold text-center">
          🎮 このゲーム集を作った理由
        </h2>

        <p className="text-gray-700 leading-relaxed text-left">
          Next.js の構造理解と TSX
          の習得を目的に、「自分が遊んでいて楽しいもの」をテーマに開発しました。
          UI
          やアニメーション、音の演出まで細かく作り込むことで、触っていて気持ちよい体験を目指しています。
        </p>

        <p className="text-gray-700 leading-relaxed text-left">
          また、Framer Motion や Tailwind CSS
          などの外部ライブラリを積極的に活用し、
          「必要な機能を適切なツールで実装する」という意識も大切にしました。
          ライブラリの特性を理解しながら組み合わせることで、表現力と開発効率の両方を高めることを意識しています。
        </p>
      </section>
      <Button
        onClick={() => setShowResetModal(true)}
        className="bg-red-600 text-white font-bold px-4 py-2 rounded-full shadow-md hover:bg-red-700 hover:scale-105 transition"
      >
        データ消去
      </Button>

      {showResetModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center">
            <p className="text-lg font-bold mb-4">初期化しますかか？</p>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
                className="
      px-4 py-2 bg-red-600 text-white rounded font-bold
      shadow-[0_4px_0_#7f1d1d] 
      active:shadow-none active:translate-y-1
      transition
    "
              >
                消去する
              </button>

              <button
                onClick={() => setShowResetModal(false)}
                className="
      px-4 py-2 bg-gray-300 rounded font-bold
      shadow-[0_4px_0_#4b5563]
      active:shadow-none active:translate-y-1
      transition
    "
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
