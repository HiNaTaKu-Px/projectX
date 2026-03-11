"use client";

type Props = {
  label: string;
  color?: "green" | "sky";
  onClick: () => void;
  disabled?: boolean; // ★ 追加：無効化状態を受け取る
};

export function AuthButton({ label, color = "green", onClick, disabled }: Props) {
  // disabled が true の時はグレー、そうでない時は指定の色を適用
  const base = disabled
    ? "bg-gray-400 cursor-not-allowed" // ★ 無効時の色
    : color === "green"
    ? "bg-green-500 hover:bg-green-600 shadow-md hover:shadow-lg"
    : "bg-sky-500 hover:bg-sky-600 shadow-md hover:shadow-lg";

  return (
    <button
      onClick={onClick}
      disabled={disabled} // ★ HTMLのbutton要素に伝える
      className={`w-full py-3 text-white font-bold rounded-lg transition ${base}`}
    >
      {label}
    </button>
  );
}