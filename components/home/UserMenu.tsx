"use client";

export function UserMenu({
  open,
  user,
  onClose,
  onOpenAvatar,
  onOpenScore,
  onOpenBoard,
  onOpenLogout,
}: {
  open: boolean;
  user: any;
  onClose: () => void;
  onOpenAvatar: () => void;
  onOpenScore: () => void;
  onOpenBoard: () => void;
  onOpenLogout: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed top-18 left-2 z-50 bg-white border shadow-lg rounded-lg p-2 w-40">
      <div className="flex flex-col gap-2">
        {user && (
          <div className="flex flex-col items-center gap-2 border-b pb-2">
            <p className="text-sm font-bold text-gray-800">{user.email}</p>
          </div>
        )}

        <button
          onClick={() => {
            onOpenAvatar();
            onClose();
          }}
          className="w-full block bg-green-500 text-white px-3 py-2 rounded-md font-bold hover:bg-green-600"
        >
          アバター
        </button>

        <button
          onClick={() => {
            onOpenScore();
            onClose();
          }}
          className="w-full block bg-green-500 text-white px-3 py-2 rounded-md font-bold hover:bg-green-600"
        >
          スコア
        </button>

        <button
          onClick={() => {
            onOpenBoard();
            onClose();
          }}
          className="w-full block bg-green-500 text-white px-3 py-2 rounded-md font-bold hover:bg-green-600"
        >
          掲示板
        </button>

        {user && (
          <button
            onClick={() => {
              onOpenLogout();
              onClose();
            }}
            className="w-full block bg-red-500 text-white px-3 py-2 rounded-md font-bold hover:bg-red-600"
          >
            ログアウト
          </button>
        )}
      </div>
    </div>
  );
}
