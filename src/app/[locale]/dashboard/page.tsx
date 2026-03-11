"use client";

import { useState } from "react";
import { useSession, signOut, authClient } from "@/lib/auth-client";
import { useRouter, useParams } from "next/navigation";

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  // 設定用のステート
  const [newName, setNewName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // ゲスト判定
  const isGuest = session?.user.email === "guest@example.com";

  if (isPending) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        読み込み中...
      </div>
    );
  }

  if (!session) {
    router.push(`/${locale}/login`);
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    router.push(`/${locale}/login`);
    router.refresh();
  };

  // プロフィール更新処理
  const handleUpdateProfile = async () => {
    if (isGuest) return; // 念のためのガード
    setIsUpdating(true);
    
    const { error } = await authClient.updateUser({
      name: newName,
    });

    if (error) {
      alert("更新に失敗しました: " + error.message);
    } else {
      alert("プロフィールを更新しました！");
      setNewName("");
      router.refresh();
    }
    setIsUpdating(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <header className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              おかえりなさい、{session.user.name}さん！
            </h1>
            <p className="text-gray-500">{session.user.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            ログアウト
          </button>
        </header>

        {/* ユーザー設定セクション */}
        <section className="bg-white p-6 rounded-xl shadow-sm mb-8 border border-gray-200">
          <h2 className="text-xl font-bold mb-4 text-gray-700">ユーザー設定</h2>
          
          {isGuest && (
            <div className="mb-4 p-4 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg text-sm">
              💡 <strong>ゲストモードでプレイ中</strong><br />
              ゲストアカウントではプロフィールの変更やスコアの永久保存はできません。
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-gray-600 mb-1">表示名の変更</label>
              <input
                type="text"
                placeholder={session.user.name}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                disabled={isGuest || isUpdating}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none disabled:bg-gray-100 disabled:text-gray-400"
              />
            </div>
            <button
              onClick={handleUpdateProfile}
              disabled={isGuest || isUpdating || !newName}
              className="px-6 py-2 bg-sky-500 text-white font-bold rounded-lg hover:bg-sky-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isUpdating ? "更新中..." : "保存"}
            </button>
          </div>
        </section>

        {/* ゲーム選択セクション */}
        <h2 className="text-xl font-bold mb-4 text-gray-700">ゲームで遊ぶ</h2>
        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-green-500 hover:shadow-md transition">
            <h2 className="text-xl font-bold mb-2">High & Low</h2>
            <p className="text-gray-600 mb-4 text-sm">カードの数字を当てるシンプルなゲーム</p>
            <button
              onClick={() => router.push(`/${locale}/game/high-low`)}
              className="w-full py-2 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition"
            >
              遊ぶ
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-blue-500">
            <h2 className="text-xl font-bold mb-2">Escape Game</h2>
            <p className="text-gray-600 mb-4 text-sm">謎を解いて部屋から脱出しよう</p>
            <button className="w-full py-2 bg-blue-500 text-white rounded-lg font-bold opacity-50 cursor-not-allowed">
              準備中...
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}