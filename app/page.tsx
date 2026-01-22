"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8">
      <h1 className="text-5xl font-extrabold mb-12">ゲーム選択</h1>

      <div className="space-y-6">
        <Link href="/game/click">
          <Button className="text-3xl px-12 py-8 bg-blue-600 text-white font-bold hover:scale-105 transition">
            クリックゲーム
          </Button>
        </Link>
      </div>
    </main>
  );
}
