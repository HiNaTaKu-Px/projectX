"use client";

import { useState } from "react";
import { updatePost, deletePost } from "@/lib/actions/post";

export function PostItem({ post, currentUserId }: { post: any; currentUserId: string | undefined }) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(post.content);
  const isOwner = currentUserId === post.userId;

  if (isEditing) {
    return (
      <div className="p-4 border border-blue-500 rounded-lg bg-blue-500/5">
        <form action={async (formData) => {
          await updatePost(post.id, formData);
          setIsEditing(false);
        }}>
          <textarea
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border rounded-md bg-transparent border-slate-700 mb-2 outline-none focus:border-blue-500"
            required
          />
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => setIsEditing(false)} className="px-3 py-1 text-sm border rounded-md">
              キャンセル
            </button>
            <button type="submit" className="px-3 py-1 text-sm bg-blue-600 rounded-md text-white">
              保存
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="p-4 border border-slate-800 rounded-lg flex justify-between items-start group">
      <div className="flex-1">
        <div className="text-sm text-slate-400 mb-1 font-bold">{post.userName}</div>
        <p className="text-lg whitespace-pre-wrap">{post.content}</p>
        <div className="text-xs text-slate-500 mt-2">
          {new Date(post.createdAt).toLocaleString("ja-JP")}
        </div>
      </div>

      {isOwner && (
        <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => setIsEditing(true)} className="text-sm text-blue-400 hover:underline">
            編集
          </button>
          <form action={async () => { await deletePost(post.id); }}>
            <button className="text-sm text-red-400 hover:underline">削除</button>
          </form>
        </div>
      )}
    </div>
  );
}