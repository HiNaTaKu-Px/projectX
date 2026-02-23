"use client";

import { useState } from "react";
import { editPostAction } from "@/lib/actions/edit";

export default function EditPostForm({
  post,
}: {
  post: { id: number; content: string };
}) {
  const [content, setContent] = useState(post.content); // 初期値にDBの内容が入る
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setIsPending(true);
    setError(null);

    // Server Actionを呼び出す
    const result = await editPostAction(post.id, content);

    if (result?.error) {
      setError(result.error);
      setIsPending(false);
    }
  };

  return (
    <div className="relative bg-white border border-gray-300 rounded-lg shadow p-4 w-full max-w-md">
      {error && <p className="text-red-500 text-sm mb-2 font-bold">{error}</p>}

      <textarea
        className="border border-gray-300 rounded-md p-3 w-full h-40 focus:ring-2 focus:ring-green-500 outline-none text-gray-800"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={isPending}
      />

      <button
        className={`mt-4 w-full py-3 rounded-md font-bold text-white transition ${
          isPending || !content.trim()
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700"
        }`}
        onClick={handleSubmit}
        disabled={isPending || !content.trim()}
      >
        {isPending ? "保存中..." : "保存する"}
      </button>
    </div>
  );
}
