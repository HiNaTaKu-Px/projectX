"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerAction } from "@/app/actions/register";

import { AuthInput } from "@/components/auth/AuthInput";
import { AuthButton } from "@/components/auth/AuthButton";
import { Popup } from "@/components/auth/Popup";
import { AuthCard } from "@/components/auth/AuthCard";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [popup, setPopup] = useState<"success" | "error" | "duplicate" | null>(
    null,
  );
  const router = useRouter();

  async function handleRegister() {
    try {
      // ★★★ FormData をやめて、普通に 2 引数で呼ぶ ★★★
      const result = await registerAction(email, password);

      if (!result.ok) {
        if (result.error === "duplicate") {
          setPopup("duplicate");
        } else {
          setPopup("error");
        }
        return;
      }

      setPopup("success");

      setTimeout(() => {
        router.push("/login");
      }, 1200);
    } catch (err) {
      console.error(err);
      setPopup("error");
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50">
      <AuthCard title="アカウント作成">
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

        <AuthButton label="登録" color="sky" onClick={handleRegister} />
      </AuthCard>

      {popup === "success" && (
        <Popup
          type="success"
          message="アカウント作成成功！"
          color="green"
          onClose={() => setPopup(null)}
        />
      )}

      {popup === "error" && (
        <Popup
          type="error"
          message="アカウント作成に失敗しました…"
          color="red"
          onClose={() => setPopup(null)}
        />
      )}

      {popup === "duplicate" && (
        <Popup
          type="duplicate"
          message="このメールアドレスは既に使われています"
          color="yellow"
          onClose={() => setPopup(null)}
        />
      )}
    </div>
  );
}
