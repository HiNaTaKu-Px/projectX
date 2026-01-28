"use client";

import Link from "next/link";
import { useState } from "react";

// 共通の枠スタイルをまとめたコンポーネント
const SectionBox = ({ children }: { children: React.ReactNode }) => (
  <section className="w-full max-w-4xl mx-auto space-y-6 p-6 border-2 border-green-200 rounded-xl bg-gray-50">
    {children}
  </section>
);

export default function Home() {
  const [showResetModal, setShowResetModal] = useState(false);

  return (
    <>
      <main
        className="
    min-h-screen
    w-screen
    flex items-center justify-center
    bg-gray-100
    p-0
    border-x-4 border-gray-300
  "
      >
        <div className="w-full max-w-none space-y-12 p-6 sm:p-10 border-4 border-green-300 rounded-2xl shadow-2xl bg-white">
          {/* ホーム画面タイトル */}
          <h1 className="text-4xl font-bold text-center text-[#1f1f1f] bg-green-50 px-6 py-6 rounded-md border-2 border-green-300 shadow-[2px_2px_0_0_#90caf9] font-['VT323'] tracking-wide">
            ホーム画面
          </h1>

          {/* ゲーム選択セクション */}
          <SectionBox>
            <h1 className="text-3xl font-extrabold text-center mb-6">
              ゲーム選択
              <hr className="border-t-2 border-gray-800 mx-auto mt-0.5" />
              <hr className="border-t-2 border-gray-800 mx-auto mt-0.5" />
            </h1>

            {/* スマホ：2×2 グリッド / PC：横並び */}
            <div
              className="
      grid grid-cols-2 gap-4
      md:flex md:space-x-6 md:gap-0
    "
            >
              <button className="text-1xl px-4 py-6 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:scale-110 hover:shadow-2xl transition transform">
                <Link href="/game/click">クリック</Link>
              </button>

              <button className="text-1xl px-4 py-6 bg-pink-600 text-white font-bold rounded-xl shadow-lg hover:scale-110 hover:shadow-2xl transition transform">
                <Link href="/game/janken">じゃんけん</Link>
              </button>

              <button className="text-1xl px-4 py-6 bg-yellow-600 text-white font-bold rounded-xl shadow-lg hover:scale-110 hover:shadow-2xl transition transform">
                <Link href="/game/hockey">ホッケー</Link>
              </button>

              {/* 空白 or 追加ゲーム用 */}
              <div className="hidden md:block"></div>
            </div>
          </SectionBox>

          {/* 各ゲームの遊び方 */}
          <SectionBox>
            <h2 className="text-2xl font-bold text-center">📘 説明書</h2>
            <div className="text-left text-gray-700 space-y-4">
              <div>
                <h3 className="font-bold text-lg text-blue-600">
                  ▶ クリック ◀
                </h3>
                <ul className="list-disc">
                  <li>クリックボタンを押すとコインゲット</li>
                  <li>ガチャでアイテムを入手</li>
                  <li>コインを貯めてゲームクリアをめざそう！</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-lg text-pink-600">
                  ▶ じゃんけん ◀
                </h3>
                <ul className="list-disc ">
                  <li>CPUとじゃんけんで3勝すると勝ち上がります</li>
                  <li>3ステージ勝ち抜くと優勝！</li>
                  <li>必殺技ボタンで1回だけ即勝利できます</li>
                  <li>トーナメント表や演出も楽しんでね！</li>
                </ul>
                <div>
                  <h3 className="font-bold text-lg text-yellow-600">
                    ▶ ホッケー ◀
                  </h3>
                  <ul className="list-disc ">
                    <li>Coming soon</li>
                  </ul>
                </div>
                <h3 className="font-bold text-lg text-red-600">▶ 共通 ◀</h3>
                <ul className="list-disc">
                  <li>スクロールトップでホーム＆テーマボタン表示</li>
                  <li>データ消去ボタンでゲーム初期化</li>
                </ul>
              </div>
            </div>
          </SectionBox>

          {/* このゲーム集を作った理由 */}
          <SectionBox>
            <h2 className="text-2xl font-bold text-center">🎮 作成した理由</h2>
            <p className="text-gray-700 leading-relaxed text-left">
              Next.js の構造理解と TSX
              の習得を目的に、「自分が遊んでいて楽しいもの」をテーマに開発しました。
              UI
              やアニメーション、音の演出まで細かく作り込むことで、触っていて気持ちよい体験を目指しています。
            </p>
            <p className="text-gray-700 leading-relaxed text-left">
              また、Framer Motion や Tailwind CSS
              などの外部ライブラリを積極的に活用し、「必要な機能を適切なツールで実装する」という意識も大切にしました。
              ライブラリの特性を理解しながら組み合わせることで、表現力と開発効率の両方を高めることを意識しています。
            </p>
          </SectionBox>

          {/* データ消去ボタン */}
          <div className="flex justify-center">
            <button
              onClick={() => setShowResetModal(true)}
              className="bg-red-600 text-white font-bold px-4 py-2 rounded-full shadow-md hover:bg-red-700 hover:scale-105 transition"
            >
              データ消去
            </button>
          </div>

          {/* モーダル */}
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
                    className="px-4 py-2 bg-red-600 text-white rounded font-bold shadow-[0_4px_0_#7f1d1d] active:shadow-none active:translate-y-1 transition"
                  >
                    消去する
                  </button>
                  <button
                    onClick={() => setShowResetModal(false)}
                    className="px-4 py-2 bg-gray-300 rounded font-bold shadow-[0_4px_0_#4b5563] active:shadow-none active:translate-y-1 transition"
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <footer className="w-full text-center text-sm text-gray-500 py-6">
        © {new Date().getFullYear()} hikaru3183-sketch. Released under the MIT
        License.
      </footer>
    </>
  );
}
