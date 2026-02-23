"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { SectionBox } from "@/components/home/SectionBox";
import { ScoreModal } from "@/components/home/ScoreModal";
import { ConfirmModal } from "@/components/home/ConfirmModal";
import { LogoutSuccessModal } from "@/components/home/LogoutSuccessModal";
import { GameCard } from "@/components/home/GameCard";
import { UserStatusBar } from "@/components/home/UserStatusBar";
import { AvatarPicker } from "@/components/avatar/AvatarPicker";
import { DeleteAccountSuccessModal } from "@/components/home/DeleteAccountSuccessModal";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [modalType, setModalType] = useState<
    "reset" | "logout" | "menu" | "avatar" | "deleteAccount" | null
  >(null);

  const [logoutSuccess, setLogoutSuccess] = useState(false);
  const [scores, setScores] = useState<any[]>([]);
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  // ★ サーバーからログインユーザー取得
  useEffect(() => {
    const loadUser = async () => {
      const res = await fetch("/api/me");
      const data = await res.json();
      setUser(data.user);
    };
    loadUser();
  }, []);

  // ★ ログアウト処理
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", { method: "POST" });

      if (res.ok) {
        setUser(null);
        setModalType(null);
        setLogoutSuccess(true);
        router.refresh();
      }
    } catch (err) {
      console.error("ログアウト失敗:", err);
    }
  };

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
    {
      key: "x",
      label: "開発中",
      href: "/game/x",
      color: "bg-gray-500",
      desc: "待っててね。",
    },
  ];

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const res = await fetch("/api/score");
        if (res.ok) {
          const data = await res.json();
          setScores(data);
        }
      } catch (e) {
        console.error("スコア取得失敗:", e);
      }
    };

    fetchScores();
  }, []);

  // ★ Avatar 型を DB と一致させる
  type Avatar = {
    mode: "color" | "image";
    hair?: string;
    clothes?: string;
    bg?: string;
    image?: string;
  };

  const handleDeleteAccount = async () => {
    try {
      const res = await fetch("/api/delete-account", { method: "POST" });

      if (res.ok) {
        setUser(null);
        setModalType(null);
        setDeleteSuccess(true);
      }
    } catch (err) {
      console.error("アカウント削除失敗:", err);
    }
  };

  return (
    <>
      {deleteSuccess && (
        <DeleteAccountSuccessModal
          onClose={() => {
            setDeleteSuccess(false);
            router.push("/");
          }}
        />
      )}

      {/* ★ 左上のアバター表示（カラー or 画像） */}
      {user && (
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="fixed mt-3 left-5 z-50 rounded-full shadow hover:opacity-80 transition"
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center overflow-hidden"
            style={{ backgroundColor: user.avatar?.bg ?? "#ccc" }}
          >
            {user.avatar?.mode === "image" ? (
              <img
                src={`/avatars/${user.avatar.image}.png`}
                className="w-full h-full object-cover"
              />
            ) : (
              <svg width="40" height="40" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="30"
                  r="20"
                  fill={user.avatar?.hair ?? "#000"}
                />
                <rect
                  x="30"
                  y="50"
                  width="40"
                  height="40"
                  fill={user.avatar?.clothes ?? "#fff"}
                />
              </svg>
            )}
          </div>
        </button>
      )}

      {/* メニュー */}
      {menuOpen && (
        <div className="fixed top-18 left-2 z-50 bg-white border shadow-lg rounded-lg p-2 w-40">
          <div className="flex flex-col gap-2">
            {user && (
              <div className="flex flex-col items-center gap-2 border-b pb-2">
                <p className="text-sm font-bold text-gray-800">{user.email}</p>
              </div>
            )}

            <button
              onClick={() => {
                setModalType("avatar");
                setMenuOpen(false);
                document.body.style.overflow = "hidden"; // ★ スクロール禁止
              }}
              className="w-full block bg-green-500 text-white px-3 py-2 rounded-md font-bold hover:bg-green-600"
            >
              アバター
            </button>
            <button
              onClick={() => {
                setModalType("menu");
                setMenuOpen(false);
              }}
              className="w-full block bg-green-500 text-white px-3 py-2 rounded-md font-bold hover:bg-green-600"
            >
              スコア
            </button>

            <button
              onClick={() => {
                router.push("/board");
                setMenuOpen(false);
              }}
              className="w-full block bg-green-500 text-white px-3 py-2 rounded-md font-bold hover:bg-green-600"
            >
              掲示板
            </button>

            {user && (
              <button
                onClick={() => {
                  setModalType("logout");
                  setMenuOpen(false);
                }}
                className="w-full block bg-red-500 text-white px-3 py-2 rounded-md font-bold hover:bg-red-600"
              >
                ログアウト
              </button>
            )}
          </div>
        </div>
      )}

      {/* モーダル類 */}
      {modalType === "reset" && (
        <ConfirmModal
          type="reset"
          onConfirm={() => {
            window.location.reload();
          }}
          onCancel={() => setModalType(null)}
        />
      )}

      {modalType === "logout" && (
        <ConfirmModal
          type="logout"
          onConfirm={handleLogout}
          onCancel={() => setModalType(null)}
        />
      )}

      {modalType === "deleteAccount" && (
        <ConfirmModal
          type="deleteAccount"
          onConfirm={handleDeleteAccount}
          onCancel={() => setModalType(null)}
        />
      )}

      {modalType === "avatar" && (
        <div className="fixed inset-0 bg-green-50 bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white p-4 rounded-xl shadow-xl w-80">
            <AvatarPicker
              initial={user?.avatar}
              onSave={async (newAvatar: Avatar) => {
                await fetch("/api/avatar", {
                  method: "POST",
                  body: JSON.stringify(newAvatar),
                });

                // ★ DB 更新後、最新ユーザー情報を再取得
                const res = await fetch("/api/me");
                const data = await res.json();
                setUser(data.user);

                // ★ スクロール解除
                document.body.style.overflow = "auto";

                setModalType(null);
              }}
              onClose={() => {
                // ★ スクロール解除
                document.body.style.overflow = "auto";

                setModalType(null);
              }}
            />
          </div>
        </div>
      )}

      {logoutSuccess && (
        <LogoutSuccessModal onClose={() => setLogoutSuccess(false)} />
      )}

      {/* メイン */}
      <main className="min-h-dvh w-full overflow-x-hidden flex items-center justify-center bg-gray-100">
        <div className="w-full p-2 border-4 border-green-300 rounded-2xl shadow-2xl bg-white space-y-2">
          {modalType === "menu" && (
            <ScoreModal scores={scores} onClose={() => setModalType(null)} />
          )}

          <div className="relative w-full flex items-center px-2 py-2">
            <div className="flex-shrink-0">
              <UserStatusBar user={user} />
            </div>

            <h1 className="absolute left-1/2 -translate-x-1/2 text-3xl font-bold">
              ホーム
            </h1>

            <button
              onClick={() => {
                router.push("/ranking");
                setMenuOpen(false);
              }}
              className="ml-auto bg-green-500 text-white px-3 py-2 rounded-md font-bold hover:bg-green-600 flex-shrink-0"
            >
              ランキング
            </button>
          </div>

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

              {user && (
                <button
                  onClick={() => setModalType("deleteAccount")}
                  className="px-3 py-2 bg-red-500 text-white font-bold rounded-md shadow hover:bg-red-700 transition"
                >
                  アカウント消去
                </button>
              )}
            </div>
          </SectionBox>
        </div>
      </main>

      <footer className="w-full text-center text-sm text-gray-500 py-6">
        © {new Date().getFullYear()} HiNaTaKu-Px. Released under the MIT
        License.
      </footer>
    </>
  );
}
