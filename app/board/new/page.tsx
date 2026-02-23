"use client";

import { useState, useEffect } from "react";
import { createPostAction, editPostAction } from "@/lib/actions/post";
import Link from "next/link";

export default function NewPostPage({ params }: { params?: { id?: string } }) {
  const isEdit = Boolean(params?.id); // ← 編集モード判定
  const [content, setContent] = useState("");
  const [isPending, setIsPending] = useState(false);

  // ★ 編集モードなら既存の投稿を取得
  useEffect(() => {
    if (!isEdit) return;

    const loadPost = async () => {
      const res = await fetch(`/api/post/${params!.id}`);
      const data = await res.json();
      setContent(data.content);
    };

    loadPost();
  }, [isEdit, params]);

  const submit = async () => {
    setIsPending(true);

    let result;

    if (isEdit) {
      // ★ 編集モード
      result = await editPostAction(Number(params!.id), content);
    } else {
      // ★ 新規投稿
      result = await createPostAction(content);
    }

    if (result?.error) {
      alert(result.error);
      setIsPending(false);
      return;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50">
      {/* タイトル */}
      <h1 className="p-10 text-2xl font-bold text-center text-gray-800">
        {isEdit ? "✏️ 投稿を編集" : "📝 新規投稿"}
      </h1>

      {/* 戻るボタン */}
      <Link
        href="/board"
        className="mb-6 bg-green-300 text-white px-4 py-2 rounded-md font-bold shadow hover:bg-green-200 transition"
      >
        掲示板に戻る
      </Link>

      {/* 投稿フォーム */}
      <div className="relative bg-white border border-gray-300 rounded-lg shadow p-4">
        <textarea
          className="border border-gray-300 rounded-md p-3 w-full h-40 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isPending}
          placeholder="ここに投稿内容を書いてください…"
        />

        <button
          className="mt-4 w-full bg-green-600 text-white py-3 rounded-md font-bold shadow hover:bg-green-700 transition disabled:bg-gray-400"
          onClick={submit}
          disabled={isPending || !content}
        >
          {isPending ? "保存中..." : isEdit ? "保存する" : "投稿する"}
        </button>
      </div>
    </div>
  );
}
