"use client";

export function Joystick({
  onMove,
  onEnd,
}: {
  onMove: (e: any) => void;
  onEnd: () => void;
}) {
  return (
    <div
      className="
        fixed bottom-6 left-1/2 -translate-x-1/2
        w-32 h-32
        bg-white/10 backdrop-blur-md
        rounded-full border border-white/20
        z-[9999]
        block md:hidden
      "
      onTouchStart={onMove}
      onTouchMove={onMove}
      onTouchEnd={onEnd}
    >
      <div
        id="stick"
        className="
          w-10 h-10 bg-white/40 rounded-full
          absolute top-1/2 left-1/2
          -translate-x-1/2 -translate-y-1/2
        "
      />
    </div>
  );
}
