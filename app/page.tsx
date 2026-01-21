"use client";

import { useState } from "react";
import Link from "next/link";
import SoundButton from "../components/SoundButton";
import MessageBox from "../components/MessageBox";

export default function Home() {
  const [coins, setCoins] = useState(0);
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);

  const showMessage = (text: string) => {
    setMessage(text);
    setVisible(true);
    setTimeout(() => setVisible(false), 3000);
  };

  const handleClick = () => {
    setCoins((prev) => prev + 1);
    showMessage("コインゲット！");
  };

  return (
    <main className="min-h-screen bg-white text-gray-800 p-6 space-y-6">
      <h1 className="text-4xl font-bold text-center">クリックゲーム</h1>

      <div className="flex justify-center">
        <SoundButton
          className="bg-blue-500 text-white px-6 py-4 rounded text-2xl font-bold"
          onClick={handleClick}
        >
          クリック
        </SoundButton>
      </div>

      <div className="flex justify-center gap-4">
        <Link href="/shop">
          <SoundButton className="bg-green-500 text-white px-4 py-2 rounded">
            ショップ
          </SoundButton>
        </Link>
        <SoundButton className="bg-purple-500 text-white px-4 py-2 rounded">
          背景変更
        </SoundButton>
        <Link href="/help">
          <SoundButton className="bg-gray-500 text-white px-4 py-2 rounded">
            説明書
          </SoundButton>
        </Link>
      </div>

      <div className="border p-4 rounded bg-gray-100 max-w-md mx-auto">
        <p>
          コイン: <span className="font-bold">{coins}</span>
        </p>
        <p className="mt-2">アイテム</p>
        <ul className="list-disc list-inside text-sm text-gray-700">
          {/* アイテムリストをここに表示 */}
        </ul>
      </div>

      <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
        <SoundButton className="bg-yellow-400 px-2 py-1 rounded">1連ガチャ</SoundButton>
        <SoundButton className="bg-yellow-400 px-2 py-1 rounded">10連ガチャ</SoundButton>
        <SoundButton className="bg-yellow-400 px-2 py-1 rounded">100連ガチャ</SoundButton>
        <SoundButton className="bg-yellow-400 px-2 py-1 rounded">1000連ガチャ</SoundButton>
        <SoundButton className="bg-yellow-400 px-2 py-1 rounded">10000連ガチャ</SoundButton>
        <SoundButton className="bg-red-400 px-2 py-1 rounded">オール使用</SoundButton>
      </div>

      <div className="text-center text-sm text-gray-500 mt-4">
        <MessageBox message={message} visible={visible} />
      </div>
    </main>
  );
}
