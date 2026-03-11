"use client";

import { useState, useEffect, useRef } from "react";
import { authClient } from "@/lib/auth-client"; // Better Auth
import { saveGameData, getGameProfile } from "@/lib/actions/click"; // サーバーアクション

export function useClickGame() {
  const [coins, setCoins] = useState<number>(0);
  const [items, setItems] = useState<(string | null)[]>(Array(7).fill(null));
  const [stockItems, setStockItems] = useState<Record<string, number>>({});
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const [coinEffect, setCoinEffect] = useState<any>(null);
  const [showSuperFormal, setShowSuperFormal] = useState(false);
  const [showClearButton, setShowClearButton] = useState(false);

  const effectIdRef = useRef(0);
  // ★ 保存用に常に最新の値を保持するRef
  const coinsRef = useRef(0);
  const stockItemsRef = useRef<Record<string, number>>({});
  const itemsRef = useRef<(string | null)[]>([]);

  // Better Authからセッション取得
  const { data: session, isPending } = authClient.useSession();
  const isLoggedIn = !!session?.user;

  // -----------------------------
  // ★ 1. 初期ロード (DBから復元)
  // -----------------------------
  useEffect(() => {
    if (isPending || !isLoggedIn) return;

    const loadData = async () => {
      try {
        const data = await getGameProfile();
        if (data) {
          // DBの coins (一番上のカラム) を反映
          const dbCoins = data.coins ?? 0;
          setCoins(dbCoins);
          coinsRef.current = dbCoins;

          // metadata からアイテム情報を復元 (現状のロジックに合わせる)
          const metadata = data.metadata || {};
          const loadedStock = metadata.stockItems || {};
          const loadedItems = metadata.items || Array(7).fill(null);
          
          setStockItems(loadedStock);
          setItems(loadedItems);
          
          stockItemsRef.current = loadedStock;
          itemsRef.current = loadedItems;
        }
      } catch (err) {
        console.error("Load error:", err);
      }
    };

    loadData();
  }, [session?.user.id, isPending, isLoggedIn]);

  // -----------------------------
  // ★ 2. Refへの同期 (ステート変更時に即座に反映)
  // -----------------------------
  useEffect(() => {
    coinsRef.current = coins;
    stockItemsRef.current = stockItems;
    itemsRef.current = items;
  }, [coins, stockItems, items]);

  // -----------------------------
  // ★ 3. 保存ロジック (離脱時・三重ガード)
  // -----------------------------
  const handleFinalSave = () => {
    if (!isLoggedIn) return;

    // metadataの中にアイテム情報をまとめて入れる
    const metadata = {
      items: itemsRef.current,
      stockItems: stockItemsRef.current
    };

    // サーバーアクション呼び出し (投げっぱなしで実行)
    saveGameData(coinsRef.current, metadata);
  };

  useEffect(() => {
    if (!isLoggedIn) return;

    // A: タブ閉じ・リロード
    window.addEventListener("beforeunload", handleFinalSave);

    // B: タブがバックグラウンドに回った時 (モバイル等で確実)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        handleFinalSave();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // C: React内遷移
    return () => {
      window.removeEventListener("beforeunload", handleFinalSave);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      handleFinalSave();
    };
  }, [isLoggedIn]);

  // -----------------------------
  // ★ 4. クリック (現状維持)
  // -----------------------------
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
  // ★ 5. ガチャ (現状維持)
  // -----------------------------
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
  // ★ 6. アイテム使用 (現状維持)
  // -----------------------------
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
  // ★ 7. メッセージ・演出 (現状維持)
  // -----------------------------
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
    coins, items, stockItems, message, visible, coinEffect, showSuperFormal, showClearButton,
    handleClick, handleGacha, handleUseItem, useAllItemsAllTypes, handleClear, setCoinEffect,
  };
}