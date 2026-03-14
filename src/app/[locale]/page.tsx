"use client";

import React, { useState, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

import { GameIsland } from "@/components/home/GameIsland";
import { OceanBackground } from "@/components/home/OceanBackground";
import { ScoreModal } from "@/components/home/ScoreModal";
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
  const mode = ModeToggle() as any;

  const { data: session, isPending: isAuthLoading } = authClient.useSession();
  const user = session?.user;

  const [scores, setScores] = useState<any[]>([]);
  const [modalType, setModalType] = useState<
    "menu" | "avatar" | "logout" | null
  >(null);

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          setModalType(null);
          toast.success("ログアウトしました。また遊んでね！");
          router.push(`/${locale}/login`);
        },
        onError: (ctx) => {
          toast.error("エラーが発生しました: " + ctx.error.message);
        },
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
        icon: <Gamepad2 className="w-10 h-10" />,
      },
      {
        key: "janken",
        label: t("games.janken.label"),
        href: "/game/janken",
        color: "bg-gradient-to-br from-pink-400 to-red-500",
        desc: t("games.janken.desc"),
        icon: <Hand className="w-10 h-10" />,
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
      {/* --- 下部のナビゲーションメニュー --- */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-fit px-4">
  <nav className="flex flex-row items-center bg-background/80 backdrop-blur-md rounded-2xl border shadow-2xl transition-all overflow-hidden p-1">
    
    {/* 1. ユーザー情報セクション (左側) */}
    {!isAuthLoading && user && (
      <div className="flex items-center justify-center py-2 px-4 select-none border-r border-foreground/5">
        <div className="flex items-center font-mono text-[10px] tracking-[0.2em]">
          <span className="text-foreground/20 font-black">
            ACCOUNT
          </span>
          <span className="mx-3 text-foreground/10">/</span>
          <span className="text-foreground/70 font-bold uppercase">
            {user.name}
          </span>
        </div>
      </div>
    )}

    {/* 2. ボタンセクション (右側) */}
    {/* border-t を削除し、flex-row の中の一部として配置 */}
    <div className="flex items-center gap-1 px-2 justify-center">
      <Button
        variant="ghost"
        className="flex flex-col gap-1 h-12 w-20 sm:w-24 rounded-xl transition-all hover:bg-primary/5 hover:text-primary"
        onClick={() => router.push(`/${locale}/dashboard`)}
      >
        <div className="scale-100">
          <LayoutDashboard className="w-4 h-4" />
        </div>
        <span className="text-[10px] font-bold tracking-tight">設定</span>
      </Button>
    </div>

  </nav>
</div>

      {/* モーダル群 */}
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
      <div className="flex-1 overflow-y-auto px-4 pb-40 pt-10">
        {" "}
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
