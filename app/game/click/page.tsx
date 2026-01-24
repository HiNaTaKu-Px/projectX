"use client";

import { useState, useEffect, useRef } from "react";
import MessageBox from "../../../components/MessageBox";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import SuperFormalAnimation from "@/components/animation/SuperFormalAnimation";

export default function Home() {
  const router = useRouter();

  // -----------------------------
  // Audio
  // -----------------------------
  const clickPlayer = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    clickPlayer.current = new Audio("/sounds/click/click.mp3");
  }, []);

  const playClickSound = () => {
    if (clickPlayer.current) {
      clickPlayer.current.currentTime = 0;
      clickPlayer.current.play();
    }
  };

  const withClickSound = (callback?: () => void) => () => {
    playClickSound();
    callback?.();
  };

  // -----------------------------
  // UI States
  // -----------------------------
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const [bgIndex, setBgIndex] = useState(5);
  const [coinEffect, setCoinEffect] = useState<{
    id: number;
    value: number;
  } | null>(null);
  const [showSuperFormal, setShowSuperFormal] = useState(false);
  const [showClearButton, setShowClearButton] = useState(false);

  // -----------------------------
  // Game States
  // -----------------------------
  const [coins, setCoins] = useState<number | null>(null);
  const [items, setItems] = useState<(string | null)[]>(Array(7).fill(null));
  const [stockItems, setStockItems] = useState<Record<string, number>>({});
  const safeCoins = coins ?? 0;
  const currentCoins = coins ?? 0;

  // -----------------------------
  // Constants
  // -----------------------------
  const backgrounds = [
    "bg-gradient-to-r from-neutral-700 to-neutral-900",
    "bg-white",
  ];

  const gachaItems = ["💡ノーマル", "✨レア", "🎇ウルトラレア", "🎆レジェンド"];
  const rarityOrder = [...gachaItems];

  const itemCoinValues: Record<string, number> = {
    "💡ノーマル": 100,
    "✨レア": 500,
    "🎇ウルトラレア": 3000,
    "🎆レジェンド": 10000,
  };

  // -----------------------------
  // LocalStorage
  // -----------------------------
  useEffect(() => {
    const saved = localStorage.getItem("coins");
    if (saved) {
      setCoins(JSON.parse(saved));
    } else {
      setCoins(50000); // 初期値
    }
  }, []);

  useEffect(() => {
    if (coins !== null) {
      localStorage.setItem("coins", JSON.stringify(coins));
    }
  }, [coins]);

  // -----------------------------
  // Message
  // -----------------------------
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showMessage = (text: string) => {
    setMessage(text);
    setVisible(true);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      setVisible(false);
      timeoutRef.current = null;
    }, 3000);
  };

  // -----------------------------
  // Coin Effect
  // -----------------------------

  let effectId = 0;

  const handleClick = () => {
    const amount = getRandomAmount();

    // prev が null の場合は 0 として扱う
    setCoins((prev) => (prev ?? 0) + amount);

    setCoinEffect({ id: effectId++, value: amount });
  };

  useEffect(() => {
    if (!coinEffect) return;

    const timeout = setTimeout(() => setCoinEffect(null), 800);
    return () => clearTimeout(timeout);
  }, [coinEffect]);

  // -----------------------------
  // Background
  // -----------------------------
  const changeBackground = () => {
    setBgIndex((prev) => (prev + 1) % backgrounds.length);
  };

  // -----------------------------
  // Gacha
  // -----------------------------
  const getRandomItem = () => {
    const r = Math.random();
    if (r < 0.7) return "💡ノーマル";
    if (r < 0.9) return "✨レア";
    if (r < 0.99) return "🎇ウルトラレア";
    return "🎆レジェンド";
  };

  const getRandomAmount = () => {
    const r = Math.random();
    if (r < 0.7) return 1;
    if (r < 0.9) return 50;
    if (r < 0.99) return 100;
    return 1000;
  };

  const sortedItems = Object.entries(stockItems)
    .sort(
      ([a], [b]) =>
        rarityOrder.findIndex((r) => a.includes(r)) -
        rarityOrder.findIndex((r) => b.includes(r)),
    )
    .slice(0, 6);

  const formatItemCounts = (items: string[]) => {
    const counts: Record<string, number> = {};
    for (const item of items) counts[item] = (counts[item] || 0) + 1;

    return gachaItems
      .filter((item) => counts[item])
      .map((item) => `${item}×${counts[item]}`);
  };

  const handleGacha = (count: number) => {
    const cost = 500 * count;

    // coins が null の場合はガチャ不可
    if (coins === null || coins < cost) {
      return showMessage("コインが足りません！");
    }

    const results: string[] = [];
    const newItems = [...items];
    const newStock = { ...stockItems };

    for (let i = 0; i < count; i++) {
      const item = getRandomItem();
      results.push(item);

      const index = newItems.findIndex((v) => v === null);
      if (index !== -1) newItems[index] = item;

      newStock[item] = (newStock[item] || 0) + 1;
    }

    setItems(newItems);
    setStockItems(newStock);

    // prev が null の可能性を排除
    setCoins((prev) => (prev ?? 0) - cost);

    const preview = formatItemCounts(results).join(" / ");
    showMessage(`${count}連結果：${preview}`);
  };

  // -----------------------------
  // アイテム使用
  // -----------------------------
  const handleUseItem = (itemName: string) => {
    const count = stockItems[itemName] || 0;
    if (count <= 0) return;

    const value = itemCoinValues[itemName] || 0;

    const newStock = { ...stockItems };
    newStock[itemName] = Math.max(0, count - 1);

    if (newStock[itemName] === 0) delete newStock[itemName];

    setStockItems(newStock);

    // prev が null の可能性に対応
    setCoins((prev) => (prev ?? 0) + value);

    showMessage(`${itemName} を使用して +${value} コイン獲得！`);
  };

  const useAllItemsAllTypes = () => {
    let totalCoins = 0;

    for (const itemName in stockItems) {
      const count = stockItems[itemName];
      const value = itemCoinValues[itemName];
      if (!value || !count) continue;

      totalCoins += value * count;
    }

    setStockItems({});

    // prev が null の可能性に対応
    setCoins((prev) => (prev ?? 0) + totalCoins);

    showMessage(`全アイテムを使用して +${totalCoins} コイン獲得！`);
  };

  // -----------------------------
  // ゲームクリア
  // -----------------------------
  const handleClear = () => {
    showMessage("ゲームクリア！！");
    setShowSuperFormal(true);

    setTimeout(() => {
      setShowSuperFormal(false);
      setShowClearButton(true);
    }, 1600);
  };

  return (
    <main className="relative min-h-screen overflow-hidden text-gray-800">
      <AnimatePresence mode="wait">
        {/* 背景アニメーション */}
        <motion.div
          key={bgIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          exit={{ opacity: 0 }}
          className={`absolute inset-0 -z-10 ${backgrounds[bgIndex]}`}
        />

        {/* コインエフェクト（ボタンのすぐ上に表示） */}
        {coinEffect && (
          <motion.span
            key={coinEffect.id}
            initial={{ opacity: 0, y: 0, scale: 0.8 }}
            animate={{ opacity: 1, y: -10, scale: 1.1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.4 }}
            className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 text-yellow-500 text-2xl font-extrabold pointer-events-none select-none"
          >
            +{coinEffect.value}
          </motion.span>
        )}

        {/* ゲームクリア演出 */}
        {showSuperFormal && <SuperFormalAnimation />}
      </AnimatePresence>

      <div className="p-6 space-y-15">
        <h1 className="text-3xl font-bold text-center text-[#1f1f1f] bg-blue-100 px-6 py-3 rounded-md border-2 border-blue-300 shadow-[2px_2px_0_0_#90caf9] font-['VT323'] tracking-wide">
          クリックゲーム
        </h1>

        {/* クリックボタン + コインエフェクト */}
        <div className="relative flex justify-center w-full !mb-10">
          {/* コインエフェクト */}
          {coinEffect && (
            <motion.span
              key={coinEffect.id}
              initial={{ opacity: 0, y: 0, scale: 0.8 }}
              animate={{ opacity: 1, y: -10, scale: 1.1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 text-yellow-500 text-2xl font-extrabold pointer-events-none select-none"
            >
              +{coinEffect.value}
            </motion.span>
          )}

          {/* クリックボタン */}
          <Button
            className="text-7xl px-24 py-16 font-extrabold tracking-wide bg-linear-to-r from-pink-500 to-yellow-500 text-white shadow-2xl hover:scale-110 transition rounded-3xl leading-none mx-auto"
            onClick={withClickSound(handleClick)}
          >
            クリック
          </Button>
        </div>

        <div className="flex justify-center gap-4 !mb-6">
          <Button
            onClick={withClickSound(changeBackground)}
            className="w-32 h-12 bg-gray-400 text-white font-bold shadow-[0_4px_0_#1f2937] active:shadow-none active:translate-y-1 transition"
          >
            テーマ変更
          </Button>
        </div>

        <div className="text-center mb-4">
          <p className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 border border-yellow-300 rounded-full shadow text-yellow-800 text-sm font-bold ">
            ⚜コイン:<span className="text-sm">{coins}</span>枚
          </p>
        </div>

        {Object.keys(stockItems).length > 0 && (
          <div className="border p-4 rounded bg-white/70 backdrop-blur max-w-md mx-auto shadow space-y-3 text-sm text-gray-800">
            {/* 所持アイテム（ストック） */}
            <div className="text-gray-700">
              <p className="mb-4">🎒 所持アイテム:</p>
              <ul className="space-y-1">
                {sortedItems.map(([name, count]) => (
                  <li key={name} className="flex items-center">
                    <span className="text-sm">
                      {name} ×{count}
                    </span>
                    <Button
                      size="sm"
                      onClick={withClickSound(() => handleUseItem(name))}
                      className="ml-auto bg-indigo-500 text-white text-xs px-2 py-1 hover:scale-105 transition"
                    >
                      使用
                    </Button>
                  </li>
                ))}
              </ul>
            </div>

            {/* 全使用ボタン */}
            <div className="flex justify-end">
              <Button
                size="sm"
                onClick={withClickSound(useAllItemsAllTypes)}
                className="w-24 h-8 bg-red-600 text-white font-bold hover:scale-105 transition text-xs"
              >
                全使用
              </Button>
            </div>
          </div>
        )}

        <div className="text-center mb-4">
          <div className="inline-flex flex-col items-center gap-1 px-4 py-3 bg-purple-100 border border-purple-300 rounded-xl shadow text-purple-800 text-sm font-bold">
            {/* 上：ガチャ料金 */}
            <div>
              🎡 ガチャ料金：
              <span className="text-sm">
                1回 500枚 / 10回 5000枚 / 100回 50000枚
              </span>
            </div>

            {/* 下：排出アイテム */}
            <div className="text-xs font-semibold text-purple-700">
              📦 排出アイテム：💡ノーマル/ ✨レア/ 🎇ウルトラレア/ 🎆レジェンド
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 max-w-md mx-auto !mb-4">
          <Button
            size="sm"
            onClick={withClickSound(() => handleGacha(1))}
            disabled={currentCoins < 500}
            className={`
    text-white font-bold hover:scale-105 transition
    ${currentCoins < 500 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500"}
  `}
          >
            1回：500枚
          </Button>

          <Button
            size="sm"
            onClick={withClickSound(() => handleGacha(10))}
            disabled={currentCoins < 5000}
            className={`
    text-white font-bold hover:scale-105 transition
    ${
      currentCoins < 5000
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-gradient-to-r from-green-400 to-blue-500"
    }
  `}
          >
            10回：5000枚
          </Button>

          <Button
            size="sm"
            onClick={withClickSound(() => handleGacha(100))}
            disabled={currentCoins < 50000}
            className={`
    text-white font-bold hover:scale-105 transition
    ${
      currentCoins < 50000
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500"
    }
  `}
          >
            100回：50000枚
          </Button>

          {safeCoins >= 0 && (
            <Button
              size="sm"
              onClick={withClickSound(handleClear)}
              className={`
                col-span-3
                text-white font-extrabold shadow-xl hover:scale-110 transition
                ${
                  safeCoins >= 100000
                    ? "bg-[linear-gradient(90deg,red,#ff7f00,yellow,#00ff00,#00ffff,#0000ff,#8b00ff)]"
                    : "bg-gray-600"
                }
              `}
              style={{
                opacity: Math.min(safeCoins / 100000, 1), // 0〜1 の範囲で濃くなる
              }}
              disabled={safeCoins < 100000}
            >
              CLEAR
            </Button>
          )}
        </div>
        <div className="text-center text-sm text-gray-700 mt-4 drop-shadow">
          <MessageBox message={message} visible={visible} />
        </div>
      </div>
      {showClearButton && (
        <div className="fixed inset-0 z-999 flex items-center justify-center">
          {/* ← 背景を薄い灰色で覆うオーバーレイ */}
          <div className="absolute inset-0 bg-gray-500/50 backdrop-blur-sm"></div>

          {/* ← ボタン本体（前面に表示） */}
          <button
            onClick={() => router.back()}
            className="relative px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:scale-105 transition"
          >
            ホーム画面
          </button>
        </div>
      )}
    </main>
  );
}
