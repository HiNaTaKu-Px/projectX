"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const SectionBox = ({ children }: { children: React.ReactNode }) => (
  <section className="w-full max-w-4xl mx-auto p-4 space-y-4 border-2 border-green-200 rounded-xl bg-gray-50 mb-2">
    {children}
  </section>
);

export default function Home() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [modalType, setModalType] = useState<"reset" | "logout" | null>(null);
  const [logoutSuccess, setLogoutSuccess] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const games = [
    {
      key: "click",
      label: "クリック",
      href: "/game/click",
      color: "bg-yellow-500",
      desc: "押して、当てて、貯めて。",
    },
    {
      key: "janken",
      label: "ジャンケン",
      href: "/game/janken",
      color: "bg-pink-500",
      desc: "勝ち進んで、優勝。",
    },
    {
      key: "hockey",
      label: "ホッケー",
      href: "/game/hockey",
      color: "bg-indigo-500",
      desc: "自分を超えろ。",
    },
    {
      key: "escape",
      label: "エスケープ",
      href: "/game/escape",
      color: "bg-violet-500",
      desc: "集めて逃げろ。",
    },
  ];

  return (
    <>
      <main
        className="
    min-h-screen w-screen flex items-center justify-center
    bg-gray-100
  "
      >
        <div
          className="
      w-full min-h-[100dvh]
      max-w-none p-2
      border-4 border-green-300 rounded-2xl shadow-2xl
      bg-white space-y-2
    "
        >
          <div className="relative">
            <h1 className="text-5xl font-bold text-center text-[#1f1f1f] bg-green-50 px-6 py-6 rounded-md border-4 border-green-300 ">
              メインメニュー
            </h1>
          </div>

          <div className="w-full flex justify-center items-center gap-2">
            <p className="text-sm font-bold text-green-700 px-1">
              {user ? `⭕ : ${user.email}` : "❌ : ログインしていません"}
            </p>

            {!user && (
              <>
                <button
                  onClick={() => router.push("/login")}
                  className="px-2 py-0.5 text-xs bg-green-500 text-white font-bold rounded-md shadow hover:bg-green-600 transition"
                >
                  ログイン
                </button>

                <button
                  onClick={() => router.push("/signup")}
                  className="px-2 py-0.5 text-xs bg-sky-500 text-white font-bold rounded-md shadow hover:bg-sky-600 transition"
                >
                  アカウント作成
                </button>
              </>
            )}
          </div>

          {/* 🎮 ゲーム選択（カード型） */}
          <SectionBox>
            <h1 className="text-3xl font-extrabold text-center mb-2">
              ゲーム選択
              <hr className="border-t-2 border-gray-800 mx-auto mt-0.5" />
              <hr className="border-t-2 border-gray-800 mx-auto mt-0.5" />
            </h1>

            <div className="flex flex-col gap-2">
              {games.map((g) => (
                <div
                  key={g.key}
                  className="flex flex-col gap-2 p-4 border rounded-xl bg-white shadow"
                >
                  <button
                    className={`w-full text-xl px-4 py-6 text-white font-bold rounded-xl shadow-lg hover:scale-105 hover:shadow-2xl transition transform ${g.color}`}
                  >
                    <Link href={g.href}>{g.label}</Link>
                  </button>

                  <p className="text-sm text-gray-700">▶ {g.desc}</p>
                </div>
              ))}

              {/* 共通 */}
              <div className="flex flex-col gap-2 p-4 border rounded-xl bg-white shadow">
                <div className="text-lg font-bold text-gray-700">共通</div>

                <p className="text-sm text-gray-700">
                  ▶ データ消去ボタンでゲーム初期化
                </p>

                <button
                  onClick={() => setModalType("reset")}
                  className="px-3 py-2 bg-red-500 text-white font-bold rounded-md shadow hover:bg-red-700 transition"
                >
                  データ消去
                </button>

                {user && (
                  <button
                    onClick={() => setModalType("logout")}
                    className="px-3 py-2 bg-red-500 text-white font-bold rounded-md shadow hover:bg-red-600 transition"
                  >
                    ログアウト
                  </button>
                )}
              </div>
            </div>
          </SectionBox>

          {/* モーダル */}
          {modalType && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg shadow-xl text-center">
                <p className="text-lg font-bold mb-4">
                  {modalType === "reset"
                    ? "初期化しますか？"
                    : "ログアウトしますか？"}
                </p>

                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => {
                      if (modalType === "reset") {
                        localStorage.clear();
                        window.location.reload();
                      } else {
                        localStorage.removeItem("user");
                        setUser(null);
                        setModalType(null);
                        setLogoutSuccess(true);
                      }
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded font-bold shadow-[0_4px_0_#7f1d1d] active:shadow-none active:translate-y-1 transition"
                  >
                    {modalType === "reset" ? "消去する" : "ログアウト"}
                  </button>

                  <button
                    onClick={() => setModalType(null)}
                    className="px-4 py-2 bg-gray-300 rounded font-bold shadow-[0_4px_0_#4b5563] active:shadow-none active:translate-y-1 transition"
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            </div>
          )}

          {logoutSuccess && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg shadow-xl text-center">
                <p className="text-lg font-bold mb-4">ログアウトしました</p>

                <button
                  onClick={() => setLogoutSuccess(false)}
                  className="px-4 py-2 bg-green-500 text-white rounded font-bold shadow-[0_4px_0_#166534] active:shadow-none active:translate-y-1 transition"
                >
                  OK
                </button>
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
