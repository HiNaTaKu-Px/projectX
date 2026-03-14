"use client";

import { useState, useRef, useMemo, useTransition } from "react";
import { saveClickerItemsAction } from "./actions"; // パスを調整してください

export function useClickGame(initialCoins: number = 0, initialStock: Record<string, number> = {}) {
  const [coins, setCoins] = useState<number>(initialCoins);
  const [stockItems, setStockItems] = useState<Record<string, number>>(initialStock);
  const [isPending, startTransition] = useTransition();

  // 変更検知（コインまたはアイテムが変わったか）
  const isDirty = useMemo(() => {
    return coins !== initialCoins || JSON.stringify(stockItems) !== JSON.stringify(initialStock);
  }, [coins, initialCoins, stockItems, initialStock]);

  const [items, setItems] = useState<(string | null)[]>(Array(7).fill(null));
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const [coinEffect, setCoinEffect] = useState<any>(null);
  const [showSuperFormal, setShowSuperFormal] = useState(false);
  const [showClearButton, setShowClearButton] = useState(false);

  const effectIdRef = useRef(0);

  // DB保存用トリガー
  const triggerSave = (nextStock: Record<string, number>) => {
    startTransition(async () => {
      await saveClickerItemsAction(nextStock);
    });
  };

  const handleClick = () => {
    const getRandomAmount = () => {
      const r = Math.random();
      if (r < 0.7) return 1;
      if (r < 0.9) return 50;
      if (r < 0.99) return 100;
      return 1000;
    };
    const amount = getRandomAmount();
    setCoins((prev) => prev + amount);

    setCoinEffect({
      id: effectIdRef.current++,
      value: amount,
      x: 40 + Math.random() * 20,
      y: 40 + Math.random() * 20,
    });
  };

  const handleGacha = (count: number) => {
    const cost = 500 * count;
    if (coins < cost) return showMessage("コインが足りません！");

    const newItems = [...items];
    const newStock = { ...stockItems };
    const results: string[] = [];

    const getRandomItem = () => {
      const r = Math.random();
      if (r < 0.7) return "💡ノーマル";
      if (r < 0.9) return "✨レア";
      if (r < 0.99) return "🎇ウルトラ";
      return "🎆レジェンド";
    };

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
    
    // アイテム獲得時に保存
    triggerSave(newStock);

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

  const itemCoinValues: Record<string, number> = {
    "💡ノーマル": 100, "✨レア": 500, "🎇ウルトラ": 3000, "🎆レジェンド": 10000,
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
    
    // アイテム消費時に保存
    triggerSave(newStock);
    showMessage(`${itemName} を使用して +${value} コイン獲得！`);
  };

  const useAllItemsAllTypes = () => {
    let total = 0;
    for (const name in stockItems) {
      total += (itemCoinValues[name] || 0) * stockItems[name];
    }
    const nextStock = {};
    setStockItems(nextStock);
    setCoins(coins + total);
    
    // アイテム一括消費時に保存
    triggerSave(nextStock);
    showMessage(`全アイテムを使用して +${total} コイン獲得！`);
  };

  const showMessage = (text: string) => {
    setMessage(text);
    setVisible(false);
    setTimeout(() => setVisible(true), 20);
  };

  const handleClear = () => {
    setShowSuperFormal(true);
    setTimeout(() => {
      setShowSuperFormal(false);
      setShowClearButton(true);
    }, 1600);
  };

  return {
    coins, isDirty, isSaving: isPending, items, stockItems, message, visible,
    coinEffect, showSuperFormal, showClearButton,
    handleClick, handleGacha, handleUseItem, useAllItemsAllTypes, handleClear, setCoinEffect,
  };
}