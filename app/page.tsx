"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { getUserAction } from "@/app/actions/getUser";
import { getScoresAction } from "@/app/actions/getScores";

import { SectionBox } from "@/components/home/SectionBox";
import { ScoreModal } from "@/components/home/ScoreModal";
import { ConfirmModal } from "@/components/home/ConfirmModal";
import { LogoutSuccessModal } from "@/components/home/LogoutSuccessModal";
import { GameCard } from "@/components/home/GameCard";
import { UserStatusBar } from "@/components/home/UserStatusBar";

export default function Home() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [modalType, setModalType] = useState<
    "reset" | "logout" | "menu" | null
  >(null);
  const [logoutSuccess, setLogoutSuccess] = useState(false);
  const [scores, setScores] = useState<any[]>([]);

  // ユーザー情報取得
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    getUserAction(token).then((res) => {
      if (res.ok) setUser(res.user);
    });
  }, []);

  // スコア取得
  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    getScoresAction(token).then((res) => {
      if (res.ok) setScores(res.scores);
    });
  }, [user]);

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
      <main className="min-h-dvh w-full overflow-x-hidden flex items-center justify-center bg-gray-100">
        <div className="w-full min-h-dvh p-2 border-4 border-green-300 rounded-2xl shadow-2xl bg-white space-y-2">
          {user && (
            <button
              onClick={() => setModalType("menu")}
              className="fixed top-3 left-3 z-50 bg-green-600 text-white px-3 py-2 rounded-lg shadow font-bold"
            >
              スコア
            </button>
          )}

          {modalType === "menu" && (
            <ScoreModal scores={scores} onClose={() => setModalType(null)} />
          )}

          <h1 className="text-5xl font-bold text-center bg-green-50 px-6 py-6 rounded-md border-4 border-green-300">
            ホーム
          </h1>

          <UserStatusBar user={user} />

          <SectionBox>
            <h1 className="text-3xl font-extrabold text-center mb-2">
              ゲーム選択
              <hr className="border-t-2 border-gray-800 mx-auto mt-0.5" />
              <hr className="border-t-2 border-gray-800 mx-auto mt-0.5" />
            </h1>

            <div className="flex flex-col gap-2">
              {games.map(({ key, ...rest }) => (
                <GameCard key={key} {...rest} />
              ))}

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

          {modalType === "reset" && (
            <ConfirmModal
              type="reset"
              onConfirm={() => {
                localStorage.clear();
                window.location.reload();
              }}
              onCancel={() => setModalType(null)}
            />
          )}

          {modalType === "logout" && (
            <ConfirmModal
              type="logout"
              onConfirm={() => {
                localStorage.removeItem("token");
                setUser(null);
                setModalType(null);
                setLogoutSuccess(true);
              }}
              onCancel={() => setModalType(null)}
            />
          )}

          {logoutSuccess && (
            <LogoutSuccessModal onClose={() => setLogoutSuccess(false)} />
          )}
        </div>
      </main>

      <footer className="w-full text-center text-sm text-gray-500 py-6">
        © {new Date().getFullYear()} HiNaTaKu-Px. Released under the MIT
        License.
      </footer>
    </>
  );
}
