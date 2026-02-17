"use client";

import { useState, useEffect, useRef } from "react";

export function useClickGame() {
  const [coins, setCoins] = useState<number | null>(null);
  const [items, setItems] = useState<(string | null)[]>(Array(7).fill(null));
  const [stockItems, setStockItems] = useState<Record<string, number>>({});
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const [coinEffect, setCoinEffect] = useState<any>(null);
  const [showSuperFormal, setShowSuperFormal] = useState(false);
  const [showClearButton, setShowClearButton] = useState(false);

  const effectIdRef = useRef(0);

  // 初期コイン読み込み
  useEffect(() => {
    const saved = localStorage.getItem("coins");
    setCoins(saved ? JSON.parse(saved) : 10000);
  }, []);

  // コイン保存
  useEffect(() => {
    if (coins !== null) {
      localStorage.setItem("coins", JSON.stringify(coins));
    }
  }, [coins]);

  // コインクリック
  const getRandomAmount = () => {
    const r = Math.random();
    if (r < 0.7) return 1;
    if (r < 0.9) return 50;
    if (r < 0.99) return 100;
    return 1000;
  };

  const handleClick = () => {
    const amount = getRandomAmount();
    setCoins((prev) => (prev ?? 0) + amount);

    setCoinEffect({
      id: effectIdRef.current++,
      value: amount,
      x: 40 + Math.random() * 20,
      y: 40 + Math.random() * 20,
    });
  };

  // ガチャ
  const gachaItems = ["💡ノーマル", "✨レア", "🎇ウルトラ", "🎆レジェンド"];

  const getRandomItem = () => {
    const r = Math.random();
    if (r < 0.7) return "💡ノーマル";
    if (r < 0.9) return "✨レア";
    if (r < 0.99) return "🎇ウルトラ";
    return "🎆レジェンド";
  };

  const handleGacha = (count: number) => {
    const cost = 500 * count;
    if ((coins ?? 0) < cost) {
      return showMessage("コインが足りません！");
    }

    const newItems = [...items];
    const newStock = { ...stockItems };
    const results: string[] = [];

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

    const ORDER = ["💡ノーマル", "✨レア", "🎇ウルトラ", "🎆レジェンド"];

    const resultCount: Record<string, number> = {};
    for (const item of results) {
      resultCount[item] = (resultCount[item] || 0) + 1;
    }

    const formatted = ORDER.filter((name) => resultCount[name])
      .map((name) => `${name} x${resultCount[name]}`)
      .join(" / ");

    showMessage(`${count}連結果：${formatted}`);
  };

  // アイテム使用
  const itemCoinValues: Record<string, number> = {
    "💡ノーマル": 100,
    "✨レア": 500,
    "🎇ウルトラ": 3000,
    "🎆レジェンド": 10000,
  };

  const handleUseItem = (itemName: string) => {
    const count = stockItems[itemName] || 0;
    if (count <= 0) return;

    const value = itemCoinValues[itemName];
    const newStock = { ...stockItems };
    newStock[itemName] = count - 1;
    if (newStock[itemName] === 0) delete newStock[itemName];

    setStockItems(newStock);
    setCoins((prev) => (prev ?? 0) + value);

    showMessage(`${itemName} を使用して +${value} コイン獲得！`);
  };

  const useAllItemsAllTypes = () => {
    let total = 0;
    for (const name in stockItems) {
      total += (itemCoinValues[name] || 0) * stockItems[name];
    }
    setStockItems({});
    setCoins((prev) => (prev ?? 0) + total);
    showMessage(`全アイテムを使用して +${total} コイン獲得！`);
  };

  // -----------------------------
  // ★ 修正版 showMessage（ここが重要）
  // -----------------------------
  const showMessage = (text: string) => {
    setMessage(text);

    // 一度 false にしてリセット
    setVisible(false);

    // 少し遅らせて true にする
    setTimeout(() => {
      setVisible(true);
    }, 20);
  };

  // クリア
  const handleClear = () => {
    setShowSuperFormal(true);

    setTimeout(() => {
      setShowSuperFormal(false);
      setShowClearButton(true);
    }, 1600);
  };

  return {
    coins,
    items,
    stockItems,
    message,
    visible,
    coinEffect,
    showSuperFormal,
    showClearButton,

    handleClick,
    handleGacha,
    handleUseItem,
    useAllItemsAllTypes,
    handleClear,
    setCoinEffect,
  };
}
