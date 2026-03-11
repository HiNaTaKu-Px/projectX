"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { AuthInput } from "@/components/auth/AuthInput";
import { AuthButton } from "@/components/auth/AuthButton";
import { Popup } from "@/components/auth/Popup";
import { AuthCard } from "@/components/auth/AuthCard";
// インポートパスをこれまでの設定 (@/lib/auth-client) に合わせます
import { signUp } from "@/lib/auth-client";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [popup, setPopup] = useState<"success" | "error" | "duplicate" | null>(null);
  const [isPending, setIsPending] = useState(false);
  
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string; // 現在の言語(ja/en)を取得

  const handleRegister = async () => {
    setIsPending(true);
    // lib/auth-client で export した signUp を直接使用
    const { data, error } = await signUp.email({
      email: email,
      password: password,
      // 名前が必須なので、メアドの @ より前を仮の名前として登録
      name: email.split("@")[0] || "User", 
    });

    if (error) {
      // Better Auth の標準エラーコード
      if (error.code === "USER_ALREADY_EXISTS") {
        setPopup("duplicate");
      } else {
        console.error("SignUp Error:", error);
        setPopup("error");
      }
      setIsPending(false);
      return;
    }

    setPopup("success");

    // 成功時の処理
    setTimeout(() => {
      // ✅ dashboard ではなく ホームページ (/) へ移動
      router.push(`/${locale}/`);
      router.refresh();
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50">
      <AuthCard title="アカウント作成">
        <AuthInput
          type="email"
          placeholder="メールアドレス (test@example.com)"
          value={email}
          onChange={setEmail}
        />
        <AuthInput
          type="password"
          placeholder="パスワード (8文字以上)"
          value={password}
          onChange={setPassword}
        />
        <AuthButton 
          label={isPending ? "作成中..." : "登録"} 
          color="sky" 
          onClick={handleRegister} 
          disabled={isPending}
        />
      </AuthCard>

      {/* ログイン画面へ戻るボタンも追加しておくと親切です */}
      <button
        onClick={() => router.push(`/${locale}/login`)}
        className="mt-5 text-sm text-gray-500 hover:underline"
      >
        すでにアカウントをお持ちの方はこちら
      </button>

      {/* ポップアップ表示ロジック */}
      {popup === "success" && (
        <Popup
          type="success"
          message="作成成功！"
          color="green"
          onClose={() => setPopup(null)}
        />
      )}
      {popup === "error" && (
        <Popup
          type="error"
          message="作成失敗…形式を確認してください"
          color="red"
          onClose={() => setPopup(null)}
        />
      )}
      {popup === "duplicate" && (
        <Popup
          type="error"
          message="既に登録されているメールアドレスです"
          color="yellow"
          onClose={() => setPopup(null)}
        />
      )}
    </div>
  );
}