"use client";

import { useRouter } from "next/navigation";

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleHomeClick = () => {
    // ページ側に「ホームに戻りたい」という通知を送る
    const event = new CustomEvent("custom-home-request", { 
      cancelable: true 
    });
    const dispatched = window.dispatchEvent(event);

    // ページ側で preventDefault() されなかった場合のみ遷移する
    if (dispatched) {
      router.push("/");
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 z-[9999] bg-black text-white px-2 py-0.5 w-full">
      <button
          onClick={handleHomeClick}
          className="text-base font-bold hover:opacity-70 transition cursor-pointer"
        >
          ← ホーム
        </button>
      </header>

      <main>{children}</main>
    </>
  );
}    


