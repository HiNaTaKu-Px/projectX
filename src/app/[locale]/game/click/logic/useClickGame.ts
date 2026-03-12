"use client";

import { useState, useRef } from "react";

// ★ 引数に initialCoins を追加（デフォルトは0）
export function useClickGame(initialCoins: number = 0) {
  // ★ 初期値を 0 から initialCoins に変更
  const [coins, setCoins] = useState<number>(initialCoins);

  // -----------------------------
  // ★ 追加: 保存が必要かどうかの判定フラグ
  // -----------------------------
  const isDirty = coins !== initialCoins;

  const [items, setItems] = useState<(string | null)[]>(Array(7).fill(null));
  const [stockItems, setStockItems] = useState<Record<string, number>>({});
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const [coinEffect, setCoinEffect] = useState<any>(null);
  const [showSuperFormal, setShowSuperFormal] = useState(false);
  const [showClearButton, setShowClearButton] = useState(false);

  const effectIdRef = useRef(0);

  // --- 3. クリック以降、下のコードは一切変更なし ---
  const getRandomAmount = () => {
    const r = Math.random();
    if (r < 0.7) return 1;
    if (r < 0.9) return 50;
    if (r < 0.99) return 100;
    return 1000;
  };

  const handleClick = () => {
    const amount = getRandomAmount();
    setCoins((prev) => prev + amount);

    setCoinEffect({
      id: effectIdRef.current++,
      value: amount,
      x: 40 + Math.random() * 20,
      y: 40 + Math.random() * 20,
    });
  };

  // -----------------------------
  // ★ 4. ガチャ
  // -----------------------------
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
    if (coins < cost) return showMessage("コインが足りません！");

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
    setCoins(coins - cost);

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

  // -----------------------------
  // ★ 5. アイテム使用
  // -----------------------------
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
    setCoins(coins + value);

    showMessage(`${itemName} を使用して +${value} コイン獲得！`);
  };

  const useAllItemsAllTypes = () => {
    let total = 0;
    for (const name in stockItems) {
      total += (itemCoinValues[name] || 0) * stockItems[name];
    }

    setStockItems({});
    setCoins(coins + total);

    showMessage(`全アイテムを使用して +${total} コイン獲得！`);
  };

  // -----------------------------
  // ★ 6. メッセージ表示
  // -----------------------------
  const showMessage = (text: string) => {
    setMessage(text);
    setVisible(false);

    setTimeout(() => {
      setVisible(true);
    }, 20);
  };

  // -----------------------------
  // ★ 7. クリア演出
  // -----------------------------
  const handleClear = () => {
    setShowSuperFormal(true);

    setTimeout(() => {
      setShowSuperFormal(false);
      setShowClearButton(true);
    }, 1600);
  };

  return {
    coins,
    isDirty, // ★ 追加: 変更があったかどうか
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