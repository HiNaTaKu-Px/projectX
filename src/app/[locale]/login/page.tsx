"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { AuthInput } from "@/components/auth/AuthInput";
import { AuthButton } from "@/components/auth/AuthButton";
import { Popup } from "@/components/auth/Popup";
import { AuthCard } from "@/components/auth/AuthCard";
// signIn をインポート
import { signIn } from "@/lib/auth-client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [popup, setPopup] = useState<"success" | "error" | null>(null);
  const [isPending, setIsPending] = useState(false); // 処理中の状態管理
  
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  // ログイン成功時の共通処理
// ... (中略)

  // ログイン成功時の共通処理
  const handleSuccess = () => {
    setPopup("success");
    setTimeout(() => {
      router.push(`/${locale}/`); 
      router.refresh(); 
    }, 1200);
  };

// ... (以下略)  // 通常のログイン処理
  const handleLogin = async () => {
    setIsPending(true);
    const { data, error } = await signIn.email({
      email,
      password,
    });

    if (error) {
      console.error("Login Error:", error.message);
      setPopup("error");
      setIsPending(false);
      return;
    }
    handleSuccess();
  };

  // ★ ゲストログイン処理
  const handleGuestLogin = async () => {
    setIsPending(true);
    // あらかじめDBに登録しておくゲスト用アカウント情報
    const { data, error } = await signIn.email({
      email: "guest@example.com",
      password: "guestpassword123",
    });

    if (error) {
      console.error("Guest Login Error:", error.message);
      // ゲストアカウントがまだDBにない場合はコンソールで通知
      alert("ゲストアカウントの準備ができていません。一度登録画面から作成してください。");
      setIsPending(false);
      return;
    }
    handleSuccess();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50">
      <AuthCard title="ログイン">
        <AuthInput
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={setEmail}
        />
        <AuthInput
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={setPassword}
        />
        
        <div className="mt-6 space-y-3">
          {/* 通常ログインボタン */}
          <AuthButton 
            label={isPending ? "処理中..." : "ログイン"} 
            color="green" 
            onClick={handleLogin} 
            disabled={isPending}
          />
          
          {/* ゲストログインボタン */}
          <button
            onClick={handleGuestLogin}
            disabled={isPending}
            className="w-full py-3 bg-amber-500 text-white font-bold rounded-lg shadow hover:bg-amber-600 transition disabled:bg-slate-300"
          >
            {isPending ? "接続中..." : "ゲストとして遊ぶ"}
          </button>
        </div>
      </AuthCard>
      
      <button
        onClick={() => router.push(`/${locale}/register`)}
        className="mt-5 px-5 py-3 text-base bg-sky-500 text-white font-bold rounded-lg shadow hover:bg-sky-600 transition"
      >
        アカウント作成はこちら
      </button>

      {/* ポップアップ */}
      {popup === "success" && (
        <Popup 
          type="success" 
          message="ログイン成功！" 
          color="green" 
          onClose={() => setPopup(null)} 
        />
      )}
      {popup === "error" && (
        <Popup 
          type="error" 
          message="ログイン失敗…メアドかパスワードを確認してください" 
          color="red" 
          onClose={() => setPopup(null)} 
        />
      )}
    </div>
  );
}