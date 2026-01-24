"use client";

import Link from "next/link";
import { useRef, useEffect, useState } from "react";

export default function Header() {
  const clickPlayer = useRef<HTMLAudioElement | null>(null);
  const [show, setShow] = useState(true);

  useEffect(() => {
    clickPlayer.current = new Audio("/sounds/click.mp3");
  }, []);

  const playClickSound = () => {
    if (clickPlayer.current) {
      clickPlayer.current.currentTime = 0;
      clickPlayer.current.play();
    }
  };

  // ★ スクロール位置で表示/非表示を切り替える
  useEffect(() => {
    const handleScroll = () => {
      const isTop = window.scrollY === 0;
      setShow(isTop);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full p-4 bg-black/70 text-white flex items-center backdrop-blur transition-opacity duration-300 ${
        show ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <button
        onClick={playClickSound}
        className="flex items-center gap-2 hover:opacity-70 transition"
      >
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">←</span>
          <span className="text-lg font-bold">戻る</span>
        </Link>
      </button>
    </header>
  );
}
