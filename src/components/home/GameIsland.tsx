"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface GameIslandProps {
  label: string;
  href: string;
  color: string;
  desc: string;
  icon: React.ReactNode;
  delay?: number;
}

export function GameIsland({
  label,
  href,
  color,
  desc,
  icon,
  delay = 0,
}: GameIslandProps) {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay * 100);
    return () => clearTimeout(timer);
  }, [delay]);

  const handleClick = () => {
    if (isClicked) return;
    setIsClicked(true);
    setTimeout(() => {
      router.push(href);
    }, 1000);
  };

  const handleContextMenu = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      className={`
        group relative flex flex-col items-center justify-center
        w-full aspect-square max-w-[180px] cursor-pointer
        transition-all duration-500 ease-out
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
        select-none
        touch-manipulation
        [-webkit-touch-callout:none]
        [-webkit-tap-highlight-color:transparent]
        ${isClicked ? "pointer-events-none" : "pointer-events-auto"}
        hover:z-50 active:z-50
      `}
      style={{ WebkitTouchCallout: "none" }}
    >
      {/* 島のメインビジュアル */}
      <div
        className={`
          relative w-full h-full
          transition-transform duration-300
          ${isClicked ? "scale-90" : "group-hover:scale-110 group-active:scale-95"}
        `}
        style={{
          animation: isClicked ? "none" : `float ${3 + delay * 0.2}s ease-in-out infinite`,
          animationDelay: `${delay * 0.3}s`,
        }}
      >
        {/* 島のベース */}
        <div
          className={`
            absolute inset-0 rounded-[40%] 
            bg-gradient-to-b from-amber-200 via-amber-100 to-amber-300
            shadow-2xl transition-all duration-300
            ${isClicked ? "brightness-75" : "group-hover:shadow-amber-400/50"}
          `}
          style={{
            clipPath:
              "polygon(15% 60%, 5% 75%, 10% 90%, 30% 95%, 70% 95%, 90% 90%, 95% 75%, 85% 60%, 75% 55%, 50% 50%, 25% 55%)",
          }}
        />

        {/* 島のメイン部分 */}
        <div
          className={`
            absolute inset-[10%] rounded-[50%]
            ${color} shadow-inner
            flex items-center justify-center
            transition-all duration-300
            ${isClicked ? "brightness-90" : "group-hover:brightness-110"}
          `}
          style={{
            clipPath:
              "polygon(20% 70%, 10% 50%, 15% 30%, 30% 15%, 50% 10%, 70% 15%, 85% 30%, 90% 50%, 80% 70%, 60% 75%, 40% 75%)",
          }}
        >
          <div className="text-white text-4xl drop-shadow-lg" draggable="false">
            {icon}
          </div>
        </div>
      </div>

      {/* --- ラベルとコメントの入れ替えエリア --- */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-full flex justify-center items-center h-8">
        
        {/* 名前ラベル：クリックされたら消える */}
        <div className={`
          absolute bg-white/95 px-3 py-1.5 rounded-full shadow-md border border-amber-200 
          transition-all duration-300 ease-in-out
          ${isClicked 
            ? "opacity-0 scale-50 translate-y-4 pointer-events-none" 
            : "opacity-100 scale-100 translate-y-0"}
        `}>
          <span className="text-xs md:text-sm font-bold text-gray-800 whitespace-nowrap">
            {label}
          </span>
        </div>

        {/* コメント：クリックされたら名前と同じスタイルで現れる */}
        <div className={`
          absolute bg-white/95 px-3 py-1.5 rounded-full shadow-md border border-amber-200 
          transition-all duration-300 ease-out
          ${isClicked 
            ? "opacity-100 scale-110 translate-y-0" 
            : "opacity-0 scale-50 translate-y-[-4px] pointer-events-none"}
        `}>
          <span className="text-xs md:text-sm font-black text-amber-600 whitespace-nowrap">
            {desc}
          </span>
        </div>

      </div>
    </div>
  );
}