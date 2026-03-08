"use client";

import { useEffect, useState } from "react";
import { playSound } from "@/components/sound/Sound";

type Props = {
  trigger: boolean; // 演出開始トリガー
  resultText: string; // 最終結果テキスト
  onFinish: () => void; // 演出終了時に呼ばれる
};

export function JankenAnimation({ trigger, resultText, onFinish }: Props) {
  const [text, setText] = useState("");

  useEffect(() => {
    if (!trigger) return;

    setText("じゃん…");

    const t1 = setTimeout(() => {
      playSound("/sounds/janken/pon.mp3");
      setText("けん…");
    }, 500);

    const t2 = setTimeout(() => {
      playSound("/sounds/janken/pon.mp3");
      setText(resultText);
    }, 1000);

    const t3 = setTimeout(() => {
      onFinish(); // ← 親に「演出終わったよ」を通知
    }, 1500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [trigger]);

  return (
    <p className="text-center text-xl h-8 flex items-center justify-center">
      {text}
    </p>
  );
}
