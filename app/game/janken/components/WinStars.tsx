type Props = {
  label: string;
  winCount: number; // 0〜3
};

export function WinStars({ label, winCount }: Props) {
  return (
    <div className="flex">
      <span className="text-xl">{label}:</span>
      {[0, 1, 2].map((i) => (
        <span key={i} className="text-yellow-300 text-2xl">
          {i < winCount ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
}
