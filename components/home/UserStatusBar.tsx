"use client";

import { useRouter } from "next/navigation";

type Props = {
  user?: any;
};

export function UserStatusBar({ user }: Props) {
  const router = useRouter();

  return (
    <div className="w-full flex justify-center items-center py-0">
      {/* ▼ ログインしていない時だけ表示 */}
      {!user && (
        <button
          onClick={() => router.push("/login")}
          className="px-4 py-2 text-base bg-green-500 text-white font-bold rounded-lg shadow hover:bg-green-600 transition"
        >
          ログイン
        </button>
      )}

      {/* ▼ ログインしている時は何も表示しない */}
      {user && null}
    </div>
  );
}
