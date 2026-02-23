import { db } from "@/lib/db/db";
import { posts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import EditPostForm from "@/components/board/EditPostForm";
import Link from "next/link";

// Next.js 15 では params の型定義を Promise にする必要があります
export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // 1. paramsをawaitしてIDを取得
  const { id } = await params;
  const postId = Number(id);

  // 2. IDが数値でない場合は404（安全策）
  if (isNaN(postId)) {
    notFound();
  }

  // 3. DBからデータを取得 (db.query の代わりに db.select を使用してエラーを回避)
  const result = await db
    .select()
    .from(posts)
    .where(eq(posts.id, postId))
    .limit(1);

  const post = result[0];

  // 4. 投稿が見つからない場合は404を表示
  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50">
      <h1 className="p-10 text-2xl font-bold text-center text-gray-800">
        ✏️ 投稿を編集
      </h1>

      <Link
        href="/board"
        className="mb-6 bg-green-300 text-white px-4 py-2 rounded-md font-bold shadow hover:bg-green-200 transition"
      >
        掲示板に戻る
      </Link>

      {/* 取得したデータをフォーム部品に渡す。
        ここで EditPostForm がエラーになる場合は、
        ファイルの配置場所が src/components/board/EditPostForm.tsx になっているか確認してください。
      */}
      <EditPostForm post={post} />
    </div>
  );
}
