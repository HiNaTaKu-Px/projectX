import { GameLogic } from "@/app/game/hockey/logic/GameLogic";

type Props = {
  fieldRef: React.RefObject<HTMLDivElement | null>;
  logic: GameLogic | null;
  onMove: (e: React.MouseEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
};

export function GameField({ fieldRef, logic, onMove, onTouchMove }: Props) {
  return (
    <div
      ref={fieldRef}
      className="relative flex-1 bg-[#080812] border-y border-cyan-500/20"
      style={{ marginLeft: "-1rem", marginRight: "-1rem" }}
      onMouseMove={onMove}
      onTouchMove={onTouchMove}
    >
      <div
        className="absolute bg-cyan-400/40"
        style={
          logic?.isPortrait
            ? { left: 0, right: 0, top: "50%", height: "2px" }
            : { top: 0, bottom: 0, left: "50%", width: "2px" }
        }
      />

      {logic && (
        <>
          <div
            className="absolute bg-cyan-300 rounded-xl"
            style={{
              width: logic.player.w,
              height: logic.player.h,
              left: logic.player.x,
              top: logic.player.y,
            }}
          />

          <div
            className="absolute bg-cyan-300 rounded-xl"
            style={{
              width: logic.enemy.w,
              height: logic.enemy.h,
              left: logic.enemy.x,
              top: logic.enemy.y,
            }}
          />

          <div
            className="absolute rounded-full bg-teal-300 shadow-[0_0_20px_5px_rgba(0,255,200,0.5)]"
            style={{
              width: logic.puck.w,
              height: logic.puck.h,
              left: logic.puck.x,
              top: logic.puck.y,
            }}
          />
        </>
      )}
    </div>
  );
}
