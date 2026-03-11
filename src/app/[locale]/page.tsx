"use client";

import React, { useState, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner"; // toastをインポート

import { GameIsland } from "@/components/home/GameIsland";
import { OceanBackground } from "@/components/home/OceanBackground";
import { ScoreModal } from "@/components/home/ScoreModal";
// LogoutSuccessModal のインポートは削除
import { AvatarModal } from "@/components/home/AvatarModal";
import { ConfirmModal } from "@/components/home/ConfirmModal";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import {
  Hand,
  Gamepad2,
  Target,
  Zap,
  Dice1,
  LayoutDashboard,
  Trophy,
  UserCircle,
  LogOut,
  MessageSquare,
} from "lucide-react";

export default function Home() {
  const t = useTranslations("Home");
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const { data: session, isPending: isAuthLoading } = authClient.useSession();
  const user = session?.user;

  const [scores, setScores] = useState<any[]>([]);
  // logoutSuccess ステートは削除
  const [modalType, setModalType] = useState<
    "menu" | "avatar" | "logout" | null
  >(null);

  /**
   * ログアウト処理：sonnerの通知を使用
   */
  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          setModalType(null);
          // 成功時にふわっと通知を出す
          toast.success("ログアウトしました。また遊んでね！");
          router.push(`/${locale}/login`);
        },
        onError: (ctx) => {
          toast.error("エラーが発生しました: " + ctx.error.message);
        }
      },
    });
  };

  const games = useMemo(
    () => [
      {
        key: "click",
        label: t("games.click.label"),
        href: "/game/click",
        color: "bg-gradient-to-br from-yellow-400 to-orange-500",
        desc: t("games.click.desc"),
        icon: <Hand className="w-10 h-10" />,
      },
      {
        key: "janken",
        label: t("games.janken.label"),
        href: "/game/janken",
        color: "bg-gradient-to-br from-pink-400 to-red-500",
        desc: t("games.janken.desc"),
        icon: <Gamepad2 className="w-10 h-10" />,
      },
      {
        key: "hockey",
        label: t("games.hockey.label"),
        href: "/game/hockey",
        color: "bg-gradient-to-br from-indigo-400 to-cyan-500",
        desc: t("games.hockey.desc"),
        icon: <Target className="w-10 h-10" />,
      },
      {
        key: "escape",
        label: t("games.escape.label"),
        href: "/game/escape",
        color: "bg-gradient-to-br from-violet-400 to-purple-500",
        desc: t("games.escape.desc"),
        icon: <Zap className="w-10 h-10" />,
      },
      {
        key: "casino",
        label: t("games.casino.label"),
        href: "/game/x",
        color: "bg-gradient-to-br from-gray-500 to-zinc-700",
        desc: t("games.casino.desc"),
        icon: <Dice1 className="w-10 h-10" />,
      },
    ],
    [t],
  );

  return (
    <main className="fixed inset-0 w-full h-dvh bg-background overflow-hidden flex flex-col transition-colors duration-300">
      <div className="absolute inset-0 -z-10">
        <OceanBackground />
      </div>

      {/* --- 右上の設定エリア --- */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-3">
        <ModeToggle />
        {!isAuthLoading && user && (
          <div className="hidden sm:block bg-background/50 backdrop-blur px-4 py-1.5 rounded-full border text-sm font-medium text-foreground">
            {user.name}
          </div>
        )}
      </div>

      {/* --- 下部のナビゲーションメニュー --- */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50">
        <nav className="flex items-center gap-2 bg-background/80 backdrop-blur-md p-2 rounded-2xl border shadow-2xl">
          <Button
            variant="ghost"
            className="flex flex-col gap-1 h-14 w-16 sm:w-20 rounded-xl"
            onClick={() => router.push(`/${locale}/dashboard`)}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[10px] font-bold">設定</span>
          </Button>

          <Button
            variant="ghost"
            className="flex flex-col gap-1 h-14 w-16 sm:w-20 rounded-xl transition-all hover:bg-blue-500/10 hover:text-blue-500"
            onClick={() => router.push(`/${locale}/board`)}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-[10px] font-bold">掲示板</span>
          </Button>

          <Button
            variant="ghost"
            className="flex flex-col gap-1 h-14 w-16 sm:w-20 rounded-xl"
            onClick={() => setModalType("menu")}
          >
            <Trophy className="w-5 h-5" />
            <span className="text-[10px] font-bold">スコア</span>
          </Button>

          <Button
            variant="ghost"
            className="flex flex-col gap-1 h-14 w-16 sm:w-20 rounded-xl"
            onClick={() => setModalType("avatar")}
          >
            <UserCircle className="w-5 h-5" />
            <span className="text-[10px] font-bold">プロフ</span>
          </Button>

          <div className="w-px h-8 bg-border mx-1" />

          <Button
            variant="ghost"
            className="flex flex-col gap-1 h-14 w-16 sm:w-20 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => setModalType("logout")}
          >
            <LogOut className="w-5 h-5" />
            <span className="text-[10px] font-bold">終了</span>
          </Button>
        </nav>
      </div>

      {/* モーダル群 (logoutSuccess関連を消去) */}
      {modalType === "menu" && (
        <ScoreModal scores={scores} onClose={() => setModalType(null)} />
      )}
      <AvatarModal
        open={modalType === "avatar"}
        user={user}
        onClose={() => setModalType(null)}
        onSave={async () => {
          setModalType(null);
          router.refresh();
        }}
      />
      {modalType === "logout" && (
        <ConfirmModal
          type="logout"
          onConfirm={handleLogout}
          onCancel={() => setModalType(null)}
        />
      )}

      {/* メインコンテンツ */}
      <div className="flex-1 overflow-y-auto px-4 pb-32 pt-20">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-foreground text-4xl sm:text-6xl font-black drop-shadow-sm mb-12 text-center uppercase tracking-tighter">
            {t("title")}
          </h1>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-10 justify-items-center">
            {games.map(({ key, ...game }, index) => (
              <GameIsland key={key} {...game} delay={index} />
            ))}
          </div>
        </div>
      </div>

      <footer className="absolute bottom-2 left-0 right-0 z-10 text-center text-muted-foreground/50 text-[10px] pointer-events-none">
        © {new Date().getFullYear()} {t("footer")}
      </footer>
    </main>
  );
}