"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "@/app/actions/login";

import { AuthInput } from "@/components/auth/AuthInput";
import { AuthButton } from "@/components/auth/AuthButton";
import { Popup } from "@/components/auth/Popup";
import { AuthCard } from "@/components/auth/AuthCard";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [popup, setPopup] = useState<"success" | "error" | null>(null);
  const router = useRouter();

  const login = async () => {
    // ★★★ FormData をやめて、普通に 2 引数で呼ぶ ★★★
    const result = await loginAction(email, password);

    if (!result.ok || !result.token) {
      setPopup("error");
      return;
    }

    // ★★★ userId を使うために user も保存する ★★★
    localStorage.setItem("token", result.token);
    localStorage.setItem("user", JSON.stringify(result.user));

    setPopup("success");

    setTimeout(() => router.push("/"), 1200);
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
        <AuthButton label="ログイン" onClick={login} />
      </AuthCard>

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
          message="ログイン失敗…"
          color="red"
          onClose={() => setPopup(null)}
        />
      )}
    </div>
  );
}
