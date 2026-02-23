"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { SectionBox } from "@/components/home/SectionBox";
import { ScoreModal } from "@/components/home/ScoreModal";
import { LogoutSuccessModal } from "@/components/home/LogoutSuccessModal";
import { GameCard } from "@/components/home/GameCard";
import { UserStatusBar } from "@/components/home/UserStatusBar";
import { DeleteAccountSuccessModal } from "@/components/home/DeleteAccountSuccessModal";

import { AvatarButton } from "@/components/home/AvatarButton";
import { UserMenu } from "@/components/home/UserMenu";
import { AvatarModal } from "@/components/home/AvatarModal";
import { ConfirmModal } from "@/components/home/ConfirmModal";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [modalType, setModalType] = useState<
    | "reset"
    | "logout"
    | "menu"
    | "avatar"
    | "deleteAccount"
    | "deletePost"
    | null
  >(null);

  const [logoutSuccess, setLogoutSuccess] = useState(false);
  const [scores, setScores] = useState<any[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const router = useRouter();

  // ★ ログインユーザー取得
  useEffect(() => {
    const loadUser = async () => {
      const res = await fetch("/api/me");
      const data = await res.json();
      setUser(data.user);
    };
    loadUser();
  }, []);

  // ★ スコア取得
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

  // ★ Avatar 型
  type Avatar = {
    mode: "color" | "image";
    hair?: string;
    clothes?: string;
    bg?: string;
    image?: string;
  };

  // ★ ログアウト
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

  // ★ アカウント削除
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

  // ★ 投稿削除（必要なら）
  const handleDeletePost = async () => {
    console.log("投稿削除処理を書く");
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

  return (
    <>
      {/* ★ 成功モーダル */}
      {deleteSuccess && (
        <DeleteAccountSuccessModal
          onClose={() => {
            setDeleteSuccess(false);
            router.push("/");
          }}
        />
      )}

      {logoutSuccess && (
        <LogoutSuccessModal onClose={() => setLogoutSuccess(false)} />
      )}

      {/* ★ 左上アバター */}
      <AvatarButton user={user} onClick={() => setMenuOpen(!menuOpen)} />

      {/* ★ メニュー */}
      <UserMenu
        open={menuOpen}
        user={user}
        onClose={() => setMenuOpen(false)}
        onOpenAvatar={() => {
          setModalType("avatar");
          document.body.style.overflow = "hidden";
        }}
        onOpenScore={() => setModalType("menu")}
        onOpenBoard={() => router.push("/board")}
        onOpenLogout={() => setModalType("logout")}
      />

      {/* ★ ConfirmModal（reset / logout / deleteAccount / deletePost） */}
      {["reset", "logout", "deleteAccount", "deletePost"].includes(
        modalType ?? "",
      ) && (
        <ConfirmModal
          type={modalType as any}
          onConfirm={() => {
            if (modalType === "reset") window.location.reload();
            if (modalType === "logout") handleLogout();
            if (modalType === "deleteAccount") handleDeleteAccount();
            if (modalType === "deletePost") handleDeletePost();
          }}
          onCancel={() => setModalType(null)}
        />
      )}

      {/* ★ AvatarModal */}
      <AvatarModal
        open={modalType === "avatar"}
        user={user}
        onSave={async (newAvatar: Avatar) => {
          await fetch("/api/avatar", {
            method: "POST",
            body: JSON.stringify(newAvatar),
          });

          const res = await fetch("/api/me");
          const data = await res.json();
          setUser(data.user);

          document.body.style.overflow = "auto";
          setModalType(null);
        }}
        onClose={() => {
          document.body.style.overflow = "auto";
          setModalType(null);
        }}
      />

      {/* ★ メイン */}
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
