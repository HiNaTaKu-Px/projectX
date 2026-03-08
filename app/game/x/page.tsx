import { getGameStats } from "./logic/actions";
import GamePageClient from "./GamePageClient";
import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth/lucia";

export default async function GamePage() {
  // 認証チェック
  const { user } = await validateRequest();
  if (!user) {
    redirect("/login");
  }

  // actions.ts からコイン、スコア、そしてアバター情報を取得
  const stats = await getGameStats();

  // 万が一取得に失敗した場合のフォールバック
  const initialCoins = stats.ok ? stats.coins : 0;
  const initialScores = stats.ok ? stats.scores : [];

  // ★ 追加: DBから取得したアバター情報を取得（なければデフォルトを想定）
  // getGameStats が avatar を返すようにしたので、それを受け取ります
  const initialAvatar = stats.ok ? stats.avatar : null;

  // クライアント側へ「コイン」「ハイスコア」「アバター」を渡す
  return (
    <GamePageClient
      initialCoins={initialCoins}
      initialScores={initialScores}
      initialAvatar={initialAvatar} // ★ ここを追加
    />
  );
}
