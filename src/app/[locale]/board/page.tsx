import { db } from "@/db/db";
import { posts, user } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { createPost } from "@/lib/actions/post";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { PostItem } from "@/components/board/PostItem";
import Link from "next/link";
import { ChevronLeft, Lock } from "lucide-react"; // Lockアイコンを追加

export default async function BoardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // ゲストユーザーかどうかを判定
  const isGuest = session?.user.email === "guest@example.com";

  const allPosts = await db
    .select({
      id: posts.id,
      content: posts.content,
      userId: posts.userId,
      createdAt: posts.createdAt,
      userName: user.name,
    })
    .from(posts)
    .leftJoin(user, eq(posts.userId, user.id))
    .orderBy(desc(posts.createdAt));

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-8 pb-20">
      <header className="flex items-center gap-4">
        <Link href="/" className="p-2 hover:bg-slate-800 rounded-full transition">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-2xl font-bold uppercase tracking-tighter">Board</h1>
      </header>

      {/* セッションがあり、かつゲストではない場合のみフォームを表示 */}
      {session && !isGuest ? (
        <form 
          action={async (formData) => {
            "use server";
            await createPost(formData);
          }} 
          className="flex flex-col gap-2 bg-slate-900/50 p-4 rounded-xl border border-slate-800 shadow-xl"
        >
          <textarea
            name="content"
            className="w-full p-3 border rounded-md bg-background border-slate-700 focus:border-blue-500 outline-none transition resize-none"
            placeholder="いま何してる？"
            required
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-bold transition active:scale-95"
            >
              投稿する
            </button>
          </div>
        </form>
      ) : session && isGuest ? (
        /* --- ゲスト専用のメッセージ表示 --- */
        <div className="flex items-center justify-center gap-3 p-6 bg-amber-500/5 border border-amber-500/10 rounded-xl text-amber-500/80">
          <Lock className="w-4 h-4" />
          <p className="text-sm font-bold uppercase tracking-wider">
            Guest Mode: Posting is disabled (閲覧専用モード)
          </p>
        </div>
      ) : (
        <div className="p-8 border border-dashed rounded-xl text-center text-slate-500 border-slate-800">
          投稿するにはログインが必要です
        </div>
      )}

      <div className="space-y-4">
        {allPosts.map((post) => (
          <PostItem 
            key={post.id} 
            post={post} 
            // ゲストの場合は削除ボタンなども出さないように currentUserId を調整
            currentUserId={isGuest ? undefined : session?.user.id} 
          />
        ))}
      </div>
    </div>
  );
}