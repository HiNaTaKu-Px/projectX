"use client";

import { useEffect, useRef, useState } from "react";
// インポートパスを相対パスに修正して解決を図ります
import { updateCoinsAction } from "../../../../lib/actions/user";
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

export default function ClickGamePage({ initialCoins }: { initialCoins: number }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const {
    coins,
    isDirty, // ロジックから変更フラグを取得
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
  } = useClickGame(initialCoins);

  // -----------------------------
  // ★ 1. 共通の保存ロジック
  // -----------------------------
  const performSave = async () => {
    if (isSaving) return false;
    
    setIsSaving(true);
    try {
      await updateCoinsAction(coins);
      toast.success("データを保存しました！");
      return true;
    } catch (error) {
      console.error("Save Error:", error);
      toast.error("保存に失敗しました");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // -----------------------------
  // ★ 2. 保存して終了（クリア時やトーストのアクション用）
  // -----------------------------
  const handleSaveAndExit = async () => {
    if (isDirty) {
      const success = await performSave();
      if (success) router.push("/");
    } else {
      router.push("/");
    }
  };

  // -----------------------------
  // ★ 3. 戻るボタン押下時のチェック (sonner通知)
  // -----------------------------
  const handleBackWithCheck = () => {
    if (isDirty) {
      toast("保存されていないデータがあります", {
        description: "現在のコインを保存して終了しますか？",
        duration: Infinity,
        action: {
          label: "保存して終了",
          onClick: async () => {
            const success = await performSave();
            if (success) router.push("/");
          },
        },
        cancel: {
          label: "保存せず終了",
          onClick: () => router.push("/"),
        },
      });
    } else {
      router.back();
    }
  };

  // -----------------------------
  // ★ 4. タブ閉じ/リロード対策 (予備)
  // -----------------------------
  const coinsRef = useRef(coins);
  useEffect(() => {
    coinsRef.current = coins;
  }, [coins]);

  useEffect(() => {
    const backupSave = () => {
      if (coinsRef.current !== initialCoins) {
        updateCoinsAction(coinsRef.current).catch(() => {});
      }
    };
    window.addEventListener("beforeunload", backupSave);
    return () => window.removeEventListener("beforeunload", backupSave);
  }, [initialCoins]);

  // -----------------------------

  if (coins === null || coins === undefined) {
    return (
      <main className="w-full min-h-dvh flex items-center justify-center text-xl">
        読み込み中...
      </main>
    );
  }

  const ORDER = ["💡ノーマル", "✨レア", "🎇ウルトラ", "🎆レジェンド"];
  const sortedItems: [string, number][] = ORDER.filter(
    (name) => stockItems[name] !== undefined,
  ).map((name) => [name, stockItems[name] as number]);

  return (
    <main className="w-full min-h-dvh p-4 border-4 border-yellow-300 rounded-2xl shadow-2xl bg-white relative">
      <BgmController src="/sounds/click/clickbgm.mp3" />

      {/* 戻るボタン */}
      <button 
        onClick={handleBackWithCheck}
        className="absolute top-6 left-6 z-50 bg-white/80 backdrop-blur p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
      >
        🔙 戻る
      </button>

      {/* 保存中の待機表示 */}
      {isSaving && (
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

      <ItemList
        sortedItems={sortedItems}
        onUseItem={handleUseItem}
        onUseAll={useAllItemsAllTypes}
      />

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