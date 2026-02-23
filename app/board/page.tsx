export const dynamic = "force-dynamic";

import { db } from "@/lib/db/db";
import { posts, appUsers } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { cookies } from "next/headers";
import { auth } from "@/lib/auth/lucia";
import { DeleteButton } from "@/components/board/DeleteButton";

export default async function BoardPage() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(auth.sessionCookieName)?.value ?? null;

  let currentUser: any = null;
  if (sessionId) {
    const { user } = await auth.validateSession(sessionId);
    currentUser = user;
  }

  const allPosts = await db
    .select({
      id: posts.id,
      content: posts.content,
      createdAt: posts.createdAt,
      userId: posts.userId,
      userEmail: appUsers.email,
    })
    .from(posts)
    .leftJoin(appUsers, eq(posts.userId, appUsers.id))
    .orderBy(desc(posts.createdAt));

  return (
    <div className="min-h-screen bg-green-50">
      <div className="pt-10 mb-6 flex justify-center">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-800">📝 掲示板</h1>

          <Link
            href="/board/new"
            className="bg-green-300 text-white px-4 py-2 rounded-md font-bold shadow hover:bg-green-200 transition"
          >
            新規投稿
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        {allPosts.map((p) => (
          <div
            key={p.id}
            className="bg-white border border-gray-300 rounded-lg shadow p-4 relative"
          >
            <p className="text-sm text-green-700 font-bold mb-2">
              投稿者: {p.userEmail ?? "不明なユーザー"}
            </p>

            <p className="text-gray-800 text-lg whitespace-pre-wrap">
              {p.content}
            </p>

            <div className="text-right mt-3">
              <span className="text-sm text-gray-500">
                {p.createdAt?.toLocaleString()}
              </span>
            </div>

            {currentUser && p.userId === currentUser.id && (
              <div className="flex gap-3 mt-3">
                <Link
                  href={`/board/edit/${p.id}`}
                  className="text-blue-600 font-bold hover:underline"
                >
                  編集
                </Link>

                <DeleteButton postId={p.id} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
