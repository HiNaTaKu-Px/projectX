// app/game/x/components/GameButton.tsx
interface GameButtonProps {
  onClick: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger";
  children: React.ReactNode;
}

export function GameButton({
  onClick,
  disabled,
  variant = "primary",
  children,
}: GameButtonProps) {
  const themes = {
    primary: "bg-blue-600 border-blue-900",
    secondary: "bg-green-600 border-green-900",
    danger: "bg-red-600 border-red-900",
  };

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`flex-1 py-5 ${themes[variant]} rounded-2xl text-2xl sm:text-4xl font-black border-b-8 active:translate-y-2 active:border-b-0 transition-all disabled:opacity-50 text-white shadow-lg font-sans`}
    >
      {children}
    </button>
  );
}
