"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [popup, setPopup] = useState<"success" | "error" | "duplicate" | null>(
    null,
  );
  const router = useRouter();

  useEffect(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }, []);

  async function handleRegister() {
    try {
      // 🔍 まず同じメールが存在するかチェック
      const { data: existingUser } = await supabase
        .from("app_users")
        .select("*")
        .eq("email", email)
        .maybeSingle();

      if (existingUser) {
        setPopup("duplicate");
        return;
      }

      // 🔵 新規登録
      const res = await fetch("/api/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        setPopup("error");
        return;
      }

      setPopup("success");

      // 成功したらログイン画面へ
      setTimeout(() => {
        router.push("/login");
      }, 1200);
    } catch (err) {
      console.error(err);
      setPopup("error");
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 relative">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-green-200">
        <h1 className="text-3xl font-bold text-center text-green-700 mb-8 font-['VT323'] tracking-wide">
          アカウント作成
        </h1>

        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 mb-4 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 mb-6 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <button
          onClick={handleRegister}
          className="w-full py-3 bg-sky-500 text-white font-bold rounded-lg shadow-md hover:bg-sky-600 hover:shadow-lg transition"
        >
          登録
        </button>
      </div>

      {/* 成功 */}
      {popup === "success" && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-xl text-center border-2 border-green-400">
            <p className="text-xl font-bold text-green-600 mb-4">
              アカウント作成成功！
            </p>
            <button
              onClick={() => setPopup(null)}
              className="px-4 py-2 bg-green-500 text-white rounded font-bold shadow hover:bg-green-600 transition"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* 失敗 */}
      {popup === "error" && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-xl text-center border-2 border-red-400">
            <p className="text-xl font-bold text-red-600 mb-4">
              アカウント作成に失敗しました…
            </p>
            <button
              onClick={() => setPopup(null)}
              className="px-4 py-2 bg-red-500 text-white rounded font-bold shadow hover:bg-red-600 transition"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* 重複メール */}
      {popup === "duplicate" && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-xl text-center border-2 border-yellow-400">
            <p className="text-xl font-bold text-yellow-600 mb-4">
              このメールアドレスは既に使われています
            </p>
            <button
              onClick={() => setPopup(null)}
              className="px-4 py-2 bg-yellow-500 text-white rounded font-bold shadow hover:bg-yellow-600 transition"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
