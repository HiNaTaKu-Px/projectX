// @/app/game/x/components/TitleView.tsx
"use client";

interface TitleViewProps {
  onStart: () => void;
}

export function TitleView({ onStart }: TitleViewProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center pointer-events-auto relative">
      {/* メインタイトル：ラインを消して、文字自体のインパクトを最大化 */}
      <div className="relative mb-20">
        <h1 className="text-7xl sm:text-9xl font-[900] italic text-center tracking-tighter text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] select-none">
          PROJECT{" "}
          <span className="text-yellow-400 drop-shadow-[0_0_30px_rgba(234,179,8,0.5)]">
            X
          </span>
        </h1>
      </div>

      {/* スタートボタン：力強い枠線とホバー時の反転演出 */}
      <button
        onClick={onStart}
        className="group relative px-20 py-6 bg-transparent transition-all duration-300 active:scale-95"
      >
        {/* ボタンの背景：ホバーで白く塗りつぶされる */}
        <div className="absolute inset-0 border-[5px] border-white rounded-full transition-all duration-300 group-hover:bg-white group-hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] group-hover:scale-105" />

        {/* ボタンテキスト */}
        <span className="relative z-10 text-white group-hover:text-black text-2xl font-[900] tracking-[0.25em] transition-colors duration-300 uppercase">
          Start Mission
        </span>

        {/* ホバー時に現れる左右のアクセントパーツ */}
        <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-3 h-10 bg-yellow-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:-left-10 shadow-[0_0_15px_rgba(234,179,8,0.6)]" />
        <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-3 h-10 bg-yellow-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:-right-10 shadow-[0_0_15px_rgba(234,179,8,0.6)]" />
      </button>

      {/* 背景の質感演出（極薄） */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[-1] bg-[length:100%_2px,3px_100%]" />

      <style jsx>{`
        h1 {
          /* Windowsでのフォントの輪郭をはっきりさせる */
          -webkit-text-stroke: 1.5px rgba(255, 255, 255, 0.05);
        }
      `}</style>
    </div>
  );
}
