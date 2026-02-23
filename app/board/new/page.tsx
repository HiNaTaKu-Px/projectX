"use client";

import { useState } from "react";
import { createPostAction } from "@/lib/actions/post";
import Link from "next/link";

export default function NewPostPage() {
  const [content, setContent] = useState("");
  const [isPending, setIsPending] = useState(false);

  const submit = async () => {
    setIsPending(true);

    const result = await createPostAction(content);

    if (result?.error) {
      alert(result.error);
      setIsPending(false);
      return;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50">
      <h1 className="p-10 text-2xl font-bold text-center text-gray-800">
        📝 新規投稿
      </h1>

      <Link
        href="/board"
        className="mb-6 bg-green-300 text-white px-4 py-2 rounded-md font-bold shadow hover:bg-green-200 transition"
      >
        掲示板に戻る
      </Link>

      <div className="relative bg-white border border-gray-300 rounded-lg shadow p-4">
        <textarea
          className="border border-gray-300 rounded-md p-3 w-full h-40"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isPending}
          placeholder="ここに投稿内容を書いてください…"
        />

        <button
          className="mt-4 w-full bg-green-600 text-white py-3 rounded-md font-bold"
          onClick={submit}
          disabled={isPending || !content}
        >
          {isPending ? "投稿中..." : "投稿する"}
        </button>
      </div>
    </div>
  );
}
