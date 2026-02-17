import GachaButton from "@/components/click/GachaButton";

export function GachaPanel({
  currentCoins,
  handleGacha,
}: {
  currentCoins: number;
  handleGacha: (count: number) => void;
}) {
  return (
    <div className="text-[10px] px-6 grid grid-cols-3 gap-2 max-w-md mx-auto mb-4">
      <GachaButton
        soundSrc="/sounds/click/g1.mp3"
        cost={500}
        count={1}
        currentCoins={currentCoins}
        handleGacha={handleGacha}
      />

      <GachaButton
        soundSrc="/sounds/click/g2.mp3"
        cost={5000}
        count={10}
        currentCoins={currentCoins}
        handleGacha={handleGacha}
      />

      <GachaButton
        soundSrc="/sounds/click/g3.mp3"
        cost={50000}
        count={100}
        currentCoins={currentCoins}
        handleGacha={handleGacha}
      />
    </div>
  );
}
