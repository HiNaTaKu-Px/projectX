// app/game/x/highlow/HighLowUI.tsx
interface HighLowUIProps {
  score: number;
  currentNum: number;
  gameMsg: string;
  isProcessing: boolean;
  onGuess: (type: "high" | "low") => void;
  onQuit: () => void;
}

// 吹き出しコンポーネント
function MessageBubble({ text }: { text: string }) {
  return (
    // カードの上部に絶対配置。カードの大きさに合わせて自動で位置が決まる
    <div className="absolute -top-16 left-0 right-0 z-20 pointer-events-none flex justify-center">
      <div className="bg-yellow-400 text-black px-4 py-2 rounded-xl shadow-lg border-2 border-black relative animate-bounce flex items-center justify-center">
        <p className="text-base sm:text-xl font-black whitespace-nowrap tracking-tighter uppercase italic leading-none">
          {text}
        </p>
        <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-black"></div>
      </div>
    </div>
  );
}

export function HighLowUI({
  score,
  currentNum,
  gameMsg,
  isProcessing,
  onGuess,
  onQuit,
}: HighLowUIProps) {
  return (
    <div className="flex flex-col items-center h-full w-full justify-between py-4 px-4 box-border">
      {/* 1. スコア・ヘッダー (高さ固定気味) */}
      <div className="w-full flex justify-between items-center pointer-events-auto px-2 shrink-0">
        <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
          <p className="text-[10px] font-bold opacity-70 uppercase leading-none mb-1">
            Score
          </p>
          <p className="text-2xl sm:text-4xl font-black tabular-nums leading-none">
            {score}
          </p>
        </div>
        <button
          onClick={onQuit}
          className="px-4 py-2 bg-black/40 hover:bg-red-600 rounded-lg border border-white/20 transition-all text-sm font-bold"
        >
          QUIT
        </button>
      </div>

      {/* 2. メインエリア (ここが自動調整のキモ) */}
      <div className="flex-1 w-full flex items-center justify-center relative min-h-0 py-12">
        {/* カードコンテナ：aspect-ratioを使うことで、高さか幅どちらか限界まで自動で広がる */}
        <div className="relative h-full max-h-full aspect-[2/3] bg-white rounded-[7%] border-[min(1vw,6px)] border-black shadow-[0_min(2vh,12px)_0_0_rgba(0,0,0,0.3)] flex items-center justify-center">
          {/* 吹き出し */}
          <MessageBubble text={gameMsg} />

          {/* 四隅の数字 (フォントサイズも相対指定) */}
          <div className="absolute top-[5%] left-[7%] text-black font-bold text-[min(6vh,24px)] select-none">
            {currentNum}
          </div>
          <div className="absolute bottom-[5%] right-[7%] text-black font-bold text-[min(6vh,24px)] select-none rotate-180">
            {currentNum}
          </div>

          {/* 中央の大きな数字 */}
          <span className="text-black text-[min(25vh,140px)] font-black leading-none z-10 select-none tabular-nums">
            {currentNum}
          </span>
        </div>
      </div>

      {/* 3. ボタンエリア (高さ固定気味) */}
      <div className="w-full max-w-md flex gap-4 pointer-events-auto shrink-0 pb-4">
        <button
          disabled={isProcessing}
          onClick={() => onGuess("high")}
          className="flex-1 py-5 bg-blue-600 rounded-2xl text-2xl sm:text-4xl font-black border-b-8 border-blue-900 active:translate-y-2 active:border-b-0 transition-all disabled:opacity-50"
        >
          HIGH
        </button>
        <button
          disabled={isProcessing}
          onClick={() => onGuess("low")}
          className="flex-1 py-5 bg-red-600 rounded-2xl text-2xl sm:text-4xl font-black border-b-8 border-red-900 active:translate-y-2 active:border-b-0 transition-all disabled:opacity-50"
        >
          LOW
        </button>
      </div>
    </div>
  );
}
