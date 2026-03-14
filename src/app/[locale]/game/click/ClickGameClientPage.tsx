"use client";

import { useEffect, useRef, useState } from "react";
import { updateCoinsAction } from "../../../../lib/actions/user";
import { saveClickerItemsAction } from "./logic/actions"; // パスを調整してください
import { useClickGame } from "./logic/useClickGame";
import { ClickButton } from "./components/ClickButton";
import { CoinDisplay } from "./components/CoinDisplay";
import { ItemList } from "./components/ItemList";
import { GachaPanel } from "./components/GachaPanel";
import { ClearButton } from "./components/ClearButton";
import { ClearModal } from "./components/ClearModal";
import { ClearAnimation } from "../../../../components/animation/ClearAnimation";
import { CoinEffect } from "./components/CoinEffect";
import MessageBox from "./components/MessageBox";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { BgmController } from "./components/BgmController";
import { toast } from "sonner";

export default function ClickGamePage({ 
  initialCoins, 
  initialStock = {} 
}: { 
  initialCoins: number; 
  initialStock?: Record<string, number>;
}) {
  const router = useRouter();
  const [isSavingManual, setIsSavingManual] = useState(false);

  const {
    coins,
    isDirty,
    isSaving: isAutoSaving, // フック側の自動保存状態
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
  } = useClickGame(initialCoins, initialStock);

  const performSave = async () => {
    if (isSavingManual) return false;
    setIsSavingManual(true);
    try {
      // コインとアイテム在庫の両方を最終保存
      await Promise.all([
        updateCoinsAction(coins),
        saveClickerItemsAction(stockItems)
      ]);
      toast.success("データを保存しました！");
      return true;
    } catch (error) {
      console.error("Save Error:", error);
      toast.error("保存に失敗しました");
      return false;
    } finally {
      setIsSavingManual(false);
    }
  };

  const handleSaveAndExit = async () => {
    if (isDirty) {
      const success = await performSave();
      if (success) router.push("/");
    } else {
      router.push("/");
    }
  };

  useEffect(() => {
    const handleCustomHomeRequest = (e: Event) => {
      if (isDirty) {
        e.preventDefault();
        toast("保存されていないデータがあります", {
          description: "現在の進行状況を保存して終了しますか？",
          duration: Infinity,
          action: {
            label: "保存して終了",
            onClick: async () => {
              const success = await performSave();
              if (success) router.push("/");
            },
          },
        });
      }
    };
    window.addEventListener("custom-home-request", handleCustomHomeRequest);
    return () => window.removeEventListener("custom-home-request", handleCustomHomeRequest);
  }, [isDirty, coins, stockItems, isSavingManual, router]);

  const coinsRef = useRef(coins);
  const stockRef = useRef(stockItems);
  useEffect(() => {
    coinsRef.current = coins;
    stockRef.current = stockItems;
  }, [coins, stockItems]);

  useEffect(() => {
    const backupSave = () => {
      if (coinsRef.current !== initialCoins || JSON.stringify(stockRef.current) !== JSON.stringify(initialStock)) {
        updateCoinsAction(coinsRef.current).catch(() => {});
        saveClickerItemsAction(stockRef.current).catch(() => {});
      }
    };
    window.addEventListener("beforeunload", backupSave);
    return () => window.removeEventListener("beforeunload", backupSave);
  }, [initialCoins, initialStock]);

  const ORDER = ["💡ノーマル", "✨レア", "🎇ウルトラ", "🎆レジェンド"];
  const sortedItems: [string, number][] = ORDER.filter(
    (name) => stockItems[name] !== undefined,
  ).map((name) => [name, stockItems[name] as number]);

  return (
    <main className="w-full min-h-dvh p-4 border-4 border-yellow-300 rounded-2xl shadow-2xl bg-white relative">
      <BgmController src="/sounds/click/clickbgm.mp3" />

      {(isSavingManual || isAutoSaving) && (
        <div className="fixed inset-0 bg-black/10 z-[100] flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white px-8 py-4 rounded-full shadow-2xl border-2 border-yellow-400 font-bold animate-bounce">
            💰 保存中...
          </div>
        </div>
      )}

      <AnimatePresence>
        {showSuperFormal && <ClearAnimation enableSound={true} />}
      </AnimatePresence>

      <CoinDisplay coins={coins} />

      <div className="text-center">
        <ClickButton onClick={handleClick} />
        <CoinEffect coinEffect={coinEffect} onFinish={() => setCoinEffect(null)} />
      </div>

      <ItemList sortedItems={sortedItems} onUseItem={handleUseItem} onUseAll={useAllItemsAllTypes} />

      <GachaPanel currentCoins={coins} handleGacha={handleGacha} />

      <div className="text-[10px] px-6 max-w-md mx-auto mt-2">
        <ClearButton safeCoins={coins} onClear={handleClear} />
      </div>

      <div className="text-center text-xs text-gray-700 mt-4 h-16">
        <MessageBox message={message} visible={visible} duration={3} />
      </div>

      {showClearButton && <ClearModal onHome={handleSaveAndExit} />}
    </main>
  );
}