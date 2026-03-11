import React from "react";
import { db } from "@/db/db";
import { appUsers, scores } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { OceanBackground } from "@/components/home/OceanBackground";
import { Trophy, Medal, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

// サーバー側でデータを取得
async function getRankings() {
  const games = ["click", "janken", "hockey", "escape"] as const;
  const results: Record<string, any[]> = {};

  for (const game of games) {
    try {
      results[game] = await db
        .select({
          name: appUsers.name,
          email: appUsers.email,
          value: scores.value,
        })
        .from(scores)
        .innerJoin(appUsers, eq(scores.userId, appUsers.id))
        .where(eq(scores.game, game))
        .orderBy(desc(scores.value))
        .limit(10);
    } catch (e) {
      results[game] = [];
    }
  }
  return results;
}

export default async function RankingPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const ranking = await getRankings();
  const t = await getTranslations("Home");

  const gameLabels = {
    click: locale === "ja" ? "クリック" : "Clicker",
    janken: locale === "ja" ? "ジャンケン" : "Janken",
    hockey: locale === "ja" ? "ホッケー" : "Hockey",
    escape: locale === "ja" ? "エスケープ" : "Escape",
  } as const;

  const valueLabels = {
    click: locale === "ja" ? "コイン" : "Coins",
    janken: locale === "ja" ? "優勝" : "Wins",
    hockey: locale === "ja" ? "スコア" : "Score",
    escape: locale === "ja" ? "スコア" : "Score",
  } as const;

  const getMedalIcon = (index: number) => {
    if (index === 0) return <Medal className="text-yellow-400 w-6 h-6 drop-shadow-md" />;
    if (index === 1) return <Medal className="text-slate-300 w-6 h-6 drop-shadow-md" />;
    if (index === 2) return <Medal className="text-orange-400 w-6 h-6 drop-shadow-md" />;
    return <span className="w-6 text-center text-sm font-bold opacity-50">{index + 1}</span>;
  };

  return (
    <main className="min-h-screen w-full relative flex flex-col items-center py-12 px-4">
      {/* 背景 */}
      <div className="fixed inset-0 -z-10">
        <OceanBackground />
      </div>

      <div className="w-full max-w-4xl relative z-10">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-10">
          <Link 
            href={`/${locale}/`}
            className="p-3 rounded-2xl bg-background/40 backdrop-blur-md border border-white/20 hover:bg-background/60 transition-all shadow-xl"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-4xl sm:text-6xl font-black text-foreground italic uppercase tracking-tighter drop-shadow-lg">
            {locale === "ja" ? "ランキング" : "Rankings"}
          </h1>
          <div className="w-12" />
        </div>

        {/* ランキングカードグリッド */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(Object.keys(gameLabels) as (keyof typeof gameLabels)[]).map((key) => (
            <div 
              key={key} 
              className="bg-background/60 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-6 shadow-2xl transition-transform hover:scale-[1.01]"
            >
              <div className="flex justify-between items-end mb-4 border-b border-foreground/5 pb-3">
                <div className="flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-yellow-500" />
                  <h2 className="text-2xl font-black italic uppercase tracking-tight">{gameLabels[key]}</h2>
                </div>
                <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest mb-1">
                  {valueLabels[key]}
                </span>
              </div>

              <div className="space-y-2">
                {!ranking[key] || ranking[key].length === 0 ? (
                  <p className="text-muted-foreground text-center py-10 italic opacity-50">
                    No data yet...
                  </p>
                ) : (
                  ranking[key].map((item, i) => (
                    <div
                      key={i}
                      className={`flex justify-between items-center py-2.5 px-3 rounded-2xl transition-all ${
                        i < 3 ? "bg-foreground/[0.03] border border-white/5" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 flex justify-center">
                          {getMedalIcon(i)}
                        </div>
                        <span className={`font-bold truncate max-w-[150px] ${i < 3 ? "text-base" : "text-sm"}`}>
                          {item.name || item.email?.split("@")[0] || "---"}
                        </span>
                      </div>
                      <span className={`font-mono font-black ${i === 0 ? "text-xl text-yellow-500" : "text-orange-500"}`}>
                        {item.value.toLocaleString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="mt-12 text-muted-foreground/30 text-[10px] font-bold tracking-[0.2em] uppercase">
        © {new Date().getFullYear()} {t("footer")}
      </footer>
    </main>
  );
}