"use client";

import { useState, useEffect, useRef } from "react";
import MessageBox from "../../../components/MessageBox";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ClearAnimation } from "@/components/animation/ClearAnimation";
import GachaButton from "@/components/animation/GachaButton";
import Header from "@/components/Header";
import { CoinEffect, CoinEffectType } from "@/components/animation/CoinEffect";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";

const SectionBox = ({ children }: { children: React.ReactNode }) => (
  <section className="w-full max-w-sm mx-auto pt-0 px-4 pb-2 border-2 border-blue-200 rounded-xl space-y-1">
    {children}
  </section>
);

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

  const bgmRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const bgm = new Audio("/sounds/click/clickbgm.mp3");
    bgm.loop = true;
    bgm.volume = 0.5;
    bgm.play();

    bgmRef.current = bgm;

    return () => {
      bgm.pause();
    };
  }, []);

  // -----------------------------
  // UI States
  // -----------------------------
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const [coinEffect, setCoinEffect] = useState<CoinEffectType>(null);

  const effectIdRef = useRef(0);

  const handleClick = () => {
    const audio = new Audio("/sounds/coin.mp3");
    audio.volume = 0.8;
    audio.play();
    const amount = getRandomAmount();

    // ★ コインを増やす（null 対策つき）
    setCoins((prev) => (prev ?? 0) + amount);

    // ★ ランダム位置
    const randomX = Math.random() * 100;
    const randomY = Math.random() * 100;

    // ★ エフェクト表示
    setCoinEffect({
      id: effectIdRef.current++,
      value: amount,
      x: randomX,
      y: randomY,
    });
  };

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
      setCoins(30000); // 初期値
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
  const animationRef = useRef<number | null>(null);

  const showMessage = (text: string) => {
    clearTimeout(timeoutRef.current!);
    cancelAnimationFrame(animationRef.current!);

    setVisible(true);

    let i = 1;
    let msg = text[0] || "";
    let t = performance.now();

    setMessage(msg); // 最初の1文字を即表示！

    const step = (now: number) => {
      if (now - t >= 70 && i < text.length) {
        msg += text[i++];
        setMessage(msg);
        t = now;
      }

      i < text.length
        ? (animationRef.current = requestAnimationFrame(step))
        : (timeoutRef.current = setTimeout(() => setVisible(false), 3000));
    };

    animationRef.current = requestAnimationFrame(step);
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
    setCoins((prev) => (prev ?? 0) - cost);

    const preview = formatItemCounts(results).join(" / ");

    // 🎲 ガチャ演出スタート！
    let scrambleCount = 0;
    const chars = "★☆!?@#💥✨🎉💡🎇🎆";
    const scramble = () => {
      if (scrambleCount < 15) {
        const fake = Array.from(
          { length: preview.length },
          () => chars[Math.floor(Math.random() * chars.length)],
        ).join("");
        setMessage(fake);
        setVisible(true);
        scrambleCount++;
        setTimeout(scramble, 40); // スピード調整
      } else {
        showMessage(`${count}連結果：${preview}`); // タイプライター風に本物を表示！
      }
    };

    scramble();
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

    // ★ アニメーション終了後に実行
    setTimeout(() => {
      // ★ BGM を止める
      if (bgmRef.current) {
        bgmRef.current.pause();
        bgmRef.current.currentTime = 0;
      }

      // ★ 勝利音を鳴らす
      const audio = new Audio("/sounds/win.mp3");
      audio.volume = 0.8;
      audio.play();

      // ★ アニメーション後の処理
      setShowSuperFormal(false);
      setShowClearButton(true);
    }, 1600);
  };

  return (
    <main className="relative min-h-screen overflow-hidden text-gray-800">
      <SectionBox>
        <div className=" bg-neutral-900 text-white">
          <Header />
        </div>

        <AnimatePresence mode="wait">
          {/* ゲームクリア演出 */}
          {showSuperFormal && <ClearAnimation key="super-formal" />}
        </AnimatePresence>

        <div className="p-6 space-y-15">
          <h1 className="mt-10 mb-14 w-full max-w-md mx-auto text-3xl font-bold text-center text-[#1f1f1f] bg-blue-50 px-2 py-2 rounded-md border-2 border-blue-300 shadow-[2px_2px_0_0_#90caf9] font-['VT323'] tracking-wide">
            クリックゲーム
          </h1>

          {/* クリックボタン + コインエフェクト */}
          <div className="relative text-center ">
            <button
              onClick={handleClick}
              className="
  px-20 py-10 bg-yellow-500 text-white text-3xl rounded-xl
  shadow-[4px_4px_0_#d97706]
  hover:translate-y-1 hover:shadow-[2px_2px_0_#d97706]
  active:translate-y-2 active:shadow-[0px_0px_0_#d97706]
  transition
"
            >
              クリック
            </button>

            {/* ボタンの外に CoinEffect を置く */}
            <CoinEffect
              coinEffect={coinEffect}
              onFinish={() => setCoinEffect(null)}
            />
          </div>

          <div className="text-center mb-4">
            <p className="inline-flex items-center gap-2 px-6 py-4 bg-yellow-100 border border-yellow-300 rounded-full shadow text-yellow-800 text-xl font-bold ">
              ⚜コイン:<span>{coins}</span>枚
            </p>
          </div>

          {Object.keys(stockItems).length > 0 && (
            <div className="mb-4 border p-3 rounded bg-white/70 backdrop-blur max-w-sm mx-auto shadow space-y-4 text-gray-800">
              <div className="text-center mb-2">
                <div className="inline-block">
                  <p className="font-bold text-sm inline-block">
                    🎒 所持アイテム
                  </p>
                  <div className="h-[1px] bg-gray-500/50 mt-1" />
                </div>
              </div>
              {/* 横並びグリッド */}
              <div className="grid grid-cols-2 gap-2">
                {sortedItems.map(([name, count]) => (
                  <div
                    key={name}
                    className="flex flex-col items-center p-1 bg-white rounded shadow-sm"
                  >
                    {/* アイテム名 */}
                    <span className="text-xs mb-1">
                      {name} ×{count}
                    </span>

                    {/* 使用ボタン */}
                    <button
                      onClick={withClickSound(() => handleUseItem(name))}
                      className="bg-indigo-500 text-white text-[10px] px-2 py-0.5 hover:scale-105 transition rounded"
                    >
                      使用
                    </button>
                  </div>
                ))}
              </div>
              {/* 全使用ボタン（中央） */}
              <div className="flex justify-center pt-2">
                <button
                  onClick={withClickSound(useAllItemsAllTypes)}
                  className="w-28 h-9 bg-red-600 text-white font-bold hover:scale-105 transition text-xs rounded"
                >
                  全使用
                </button>
              </div>
            </div>
          )}

          <div className="text-center mb-4">
            <div className="inline-flex flex-col items-center gap-2 px-6 py-4 bg-purple-100 border border-purple-300 rounded-xl shadow text-purple-800 text-[10px] font-bold max-w-xs sm:max-w-sm">
              {/* 🎡 ガチャ料金タイトル */}
              <div className="flex flex-col items-center w-full">
                <span className="text-[11px]">🎡 ガチャ料金</span>
                <div className="w-20 h-[1px] bg-purple-500 my-1" />
                <span className="text-[10px] font-semibold">
                  1回 500枚 / 10回 5000枚 / 100回 50000枚
                </span>
              </div>

              {/* 📦 排出アイテムタイトル */}
              <div className="flex flex-col items-center w-full">
                <span className="text-[11px] font-bold">📦 排出アイテム</span>
                <div className="w-20 h-[1px] bg-purple-500 my-1" />
                <span className="text-[10px] font-semibold">
                  💡ノーマル / ✨レア / 🎇ウルトラレア / 🎆レジェンド
                </span>
              </div>
            </div>
          </div>

          {/* ガチャボタン配置 */}
          <div className="text-[10px] px-6 grid grid-cols-3 gap-2 max-w-md mx-auto !mb-4">
            <GachaButton
              soundSrc="/sounds/click/g1.mp3"
              cost={500 * 1}
              count={1}
              currentCoins={currentCoins}
              handleGacha={handleGacha}
            />

            <GachaButton
              soundSrc="/sounds/click/g2.mp3"
              cost={500 * 10}
              count={10}
              currentCoins={currentCoins}
              handleGacha={handleGacha}
            />

            <GachaButton
              soundSrc="/sounds/click/g3.mp3"
              cost={500 * 100}
              count={100}
              currentCoins={currentCoins}
              handleGacha={handleGacha}
            />

            {safeCoins >= 0 && (
              <button
                onClick={() => {
                  new Audio("/sounds/clear.mp3").play();
                  handleClear(); // ← これがちゃんと動くようになる
                }}
                className={`
      col-span-3
      py-10 px-10
      text-white text-xl font-extrabold
      shadow-xl hover:scale-110 transition
      ${
        safeCoins >= 100000
          ? "bg-[linear-gradient(90deg,red,#ff7f00,yellow,#00ff00,#00ffff,#0000ff,#8b00ff)]"
          : "bg-gray-600"
      }
    `}
                style={{
                  opacity: Math.min(safeCoins / 100000, 1),
                }}
                disabled={safeCoins < 100000}
              >
                CLEAR
              </button>
            )}
          </div>
          <div className="text-center text-xs text-gray-700 mt-4 drop-shadow">
            <MessageBox message={message} visible={visible} />
          </div>
        </div>
        {showClearButton && (
          <div className="fixed inset-0 z-999 flex flex-col items-center justify-center">
            {/* 背景オーバーレイ */}
            <div className="absolute inset-0 bg-gray-500/50 backdrop-blur-sm"></div>
            {/* ホーム画面ボタン */}

            <button
              onClick={() => {
                router.back();
              }}
              className="relative px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:scale-105 transition"
            >
              ホーム画面
            </button>
          </div>
        )}
      </SectionBox>
    </main>
  );
}
