"use client";

export function ConfirmModal({
  type,
  onConfirm,
  onCancel,
}: {
  type: "reset" | "logout" | "deleteAccount" | "deletePost";
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const title =
    type === "reset"
      ? "初期化しますか？"
      : type === "logout"
        ? "ログアウトしますか？"
        : type === "deleteAccount"
          ? "アカウントを削除しますか？"
          : "投稿を削除しますか？";

  const confirmLabel =
    type === "reset"
      ? "消去する"
      : type === "logout"
        ? "ログアウト"
        : "削除する";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
      <div className="bg-white p-6 rounded-lg shadow-xl text-center">
        <p className="text-lg font-bold mb-4">{title}</p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded font-bold shadow-[0_4px_0_#7f1d1d] active:shadow-none active:translate-y-1 transition"
          >
            {confirmLabel}
          </button>

          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded font-bold shadow-[0_4px_0_#4b5563] active:shadow-none active:translate-y-1 transition"
          >
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
}
