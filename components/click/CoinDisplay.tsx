export function CoinDisplay({ coins }: { coins: number | null }) {
  return (
    <div className="text-center mt-6">
      <p className="inline-flex items-center gap-2 px-4 py-2 mb-4 bg-yellow-100 border border-yellow-300 rounded-full shadow text-yellow-800 text-xl font-bold">
        ⚜コイン:<span>{coins}</span>枚
      </p>
    </div>
  );
}
