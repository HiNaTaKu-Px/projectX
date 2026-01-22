"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import * as Tone from "tone";
import MessageBox from "../../../components/MessageBox";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [coins, setCoins] = useState(500000);
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);

  // 背景
  const [bgIndex, setBgIndex] = useState(5);

  const backgrounds = [
    "bg-linear-to-r from-purple-500 to-pink-500",
    "bg-linear-to-r from-blue-500 to-cyan-500",
    "bg-linear-to-r from-green-500 to-lime-500",
    "bg-linear-to-r from-orange-500 to-red-500",
    "bg-linear-to-r from-indigo-500 to-purple-500",
    "bg-white",
  ];

  // 🎵 MP3 プレイヤーを保持
  const clickPlayer = useRef<Tone.Player | null>(null);

  // 🎵 クライアント側でのみ MP3 を読み込む
  useEffect(() => {
    clickPlayer.current = new Tone.Player("/sounds/click.mp3").toDestination();
  }, []);

  // 🎵 シンセ音
  const playSound = async () => {
    await Tone.start();
    const synth = new Tone.Synth().toDestination();
    synth.triggerAttackRelease("C6", "32n");
  };

  // 🎵 クリックだけ MP3
  const playClickSound = async () => {
    await Tone.start();
    clickPlayer.current?.start();
  };

  function getRandomCoin(): number {
    const r = Math.random();
    if (r < 0.7) return 1;
    if (r < 0.9) return 5;
    if (r < 0.99) return 10;
    return 100;
  }

  const showMessage = (text: string) => {
    setMessage(text);
    setVisible(true);
    setTimeout(() => setVisible(false), 3000);
  };

  const handleClick = () => {
    const amount = getRandomCoin();
    setCoins((prev) => prev + amount);
    showMessage(`${amount} コインゲット！`);
    playClickSound(); // ← MP3 再生
  };

  const changeBackground = () => {
    setBgIndex((prev) => (prev + 1) % backgrounds.length);
    playSound();
  };

  const handleClear = () => {
    showMessage("ゲームクリア！！");
    playSound();
  };

  return (
    <main className="relative min-h-screen overflow-hidden text-gray-800">
      {/* 戻るヘッダー */}
      <header className="w-full p-4 bg-black/70 text-white flex items-center backdrop-blur">
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-70 transition"
        >
          <span className="text-2xl">←</span>
          <span className="text-lg font-bold">戻る</span>
        </Link>
      </header>

      <AnimatePresence mode="wait">
        <motion.div
          key={bgIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6 }}
          className={`absolute inset-0 -z-10 ${backgrounds[bgIndex]}`}
        />
      </AnimatePresence>

      <div className="p-6 space-y-6">
        <h1 className="text-6xl font-extrabold text-center text-gray-900 drop-shadow-xl tracking-[0.5em] mt-4 mb-6">
          クリックゲーム
        </h1>

        <div className="flex justify-center w-full">
          <Button
            className="
              text-7xl
              px-24 py-16
              font-extrabold tracking-wide
              bg-linear-to-r from-pink-500 to-yellow-500
              text-white shadow-2xl
              hover:scale-110 hover:shadow-pink-500/70
              transition
              rounded-3xl
              leading-none
              mx-auto
            "
            onClick={handleClick}
          >
            クリック
          </Button>
        </div>

        {/* メニュー */}
        <div className="flex justify-center gap-4">
          <Link href="../game/click/help">
            <Button className="w-32 h-12 bg-gray-900 text-white font-bold shadow-[0_4px_0_#1f2937] active:shadow-none active:translate-y-1 transition">
              説明書
            </Button>
          </Link>

          <Link href="/game/click/shop">
            <Button className="w-32 h-12 bg-gray-900 text-white font-bold shadow-[0_4px_0_#1f2937] active:shadow-none active:translate-y-1 transition">
              ショップ
            </Button>
          </Link>

          <Button
            onClick={changeBackground}
            className="w-32 h-12 bg-gray-900 text-white font-bold shadow-[0_4px_0_#1f2937] active:shadow-none active:translate-y-1 transition"
          >
            背景変更
          </Button>
        </div>

        {/* コイン表示 */}
        <div className="border p-4 rounded bg-white/70 backdrop-blur max-w-md mx-auto shadow">
          <div className="flex justify-between items-end">
            <p>
              コイン: <span className="font-bold">{coins}</span>
            </p>

            <Button
              size="sm"
              onClick={playSound}
              className="w-20 h-8 bg-red-600 text-white font-bold hover:scale-105 transition text-xs"
            >
              アイテム全使用
            </Button>
          </div>
        </div>

        {/* ガチャボタン */}
        <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
          <Button
            size="sm"
            onClick={playSound}
            className="bg-blue-500 text-white font-bold hover:scale-105 transition"
          >
            1連
          </Button>
          <Button
            size="sm"
            onClick={playSound}
            className="text-white font-bold bg-linear-to-r from-green-400 to-blue-500 hover:scale-105 transition"
          >
            10連
          </Button>
          <Button
            size="sm"
            onClick={playSound}
            className="text-white font-bold bg-linear-to-r from-yellow-400 via-orange-500 to-red-500 hover:scale-105 transition"
          >
            100連
          </Button>
          <Button
            size="sm"
            onClick={playSound}
            className="text-white font-bold bg-linear-to-r from-purple-500 via-pink-500 to-orange-400 hover:scale-110 transition shadow-lg"
          >
            1000連
          </Button>
          <Button
            size="sm"
            onClick={playSound}
            className="text-white font-bold bg-linear-to-r from-red-500 via-yellow-500 to-blue-500 bg-size-[200%_200%] animate-[gradient_3s_ease_infinite] hover:scale-110 transition shadow-xl"
          >
            10000連
          </Button>

          {coins >= 500000 && (
            <Button
              size="sm"
              onClick={handleClear}
              className={`text-white font-extrabold bg-linear-to-r from-purple-600 via-pink-500 to-yellow-400 shadow-xl hover:scale-110 transition ${
                coins < 1000000 ? "opacity-30" : "opacity-100"
              }`}
              disabled={coins < 1000000}
            >
              🎉 クリア！ 🎉
            </Button>
          )}
        </div>
      </div>

      <div className="text-center text-sm text-gray-700 mt-4 drop-shadow">
        <MessageBox message={message} visible={visible} />
      </div>
    </main>
  );
}
