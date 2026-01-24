type Props = {
  currentStage: number;
};

const bracket = [
  ["あなた", "CPU-A"],
  ["CPU-B", "CPU-C"],
  ["CPU-D", "CPU-E"],
  ["CPU-F", "CPU-G"],
];

export default function TournamentBracket({ currentStage }: Props) {
  return (
    <div className="grid grid-cols-4 gap-4 text-center text-sm font-bold text-white bg-gray-800 p-4 rounded-lg">
      {bracket.map((pair, i) => (
        <div key={i} className="col-span-1 space-y-2">
          {pair.map((name, j) => {
            const isYou = name === "あなた";
            const isActive = currentStage > i;
            return (
              <div
                key={j}
                className={`p-2 rounded ${
                  isYou
                    ? isActive
                      ? "bg-yellow-400 text-black animate-bounce"
                      : "bg-yellow-200 text-black"
                    : isActive
                      ? "bg-green-500"
                      : "bg-gray-600"
                }`}
              >
                {name}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
