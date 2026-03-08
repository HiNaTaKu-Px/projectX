"use client";

import { useEffect, useState, useRef } from "react";

type Props = {
  message: string;
  visible: boolean;
  duration?: number; // ★ 表示完了後に消えるまでの秒数（デフォルト 5秒）
};

export default function MessageBox({ message, visible, duration = 5 }: Props) {
  const [displayText, setDisplayText] = useState("");
  const [isVisible, setIsVisible] = useState(visible);

  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    // ★ 新しいメッセージが来たら全部リセット
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);

    if (!visible || !message) {
      setDisplayText("");
      setIsVisible(false);
      return;
    }

    // 表示開始
    setIsVisible(true);
    setDisplayText("");

    let i = 0;
    let current = "";
    let lastTime = performance.now();

    const step = (now: number) => {
      if (now - lastTime >= 50 && i < message.length) {
        current += message[i++];
        setDisplayText(current);
        lastTime = now;
      }

      if (i < message.length) {
        animationRef.current = requestAnimationFrame(step);
      } else {
        // ★ 全部表示したら duration 秒後にフェードアウト
        hideTimerRef.current = setTimeout(() => {
          setIsVisible(false);
        }, duration * 1000);
      }
    };

    animationRef.current = requestAnimationFrame(step);

    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [message, visible, duration]);

  return (
    <div
      className={`text-center font-bold text-green-600 mt-4 transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {displayText}
    </div>
  );
}
