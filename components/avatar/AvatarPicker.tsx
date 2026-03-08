"use client";

import { useState } from "react";
import { useGlobalStore, Avatar } from "@/store/useGlobalStore";
import { CHARACTERS } from "@/components/avatar/avatarData";

export function AvatarPicker({
  initial,
  onSave,
  onClose,
}: {
  initial?: Avatar;
  onSave: (a: Avatar) => void;
  onClose?: () => void;
}) {
  const setGlobalAvatar = useGlobalStore((state) => state.setAvatar);

  // ★ 修正: カラー情報を削除し、mode と image だけのシンプルな初期値に
  const [avatar, setAvatar] = useState<Avatar>(
    initial ?? {
      mode: "image",
      image: "1",
    },
  );

  const [savedPopup, setSavedPopup] = useState(false);

  // 数字のみのIDリスト
  const avatarIds = ["1", "2", "3"];

  const handleSave = () => {
    onSave(avatar);
    setGlobalAvatar(avatar);
    setSavedPopup(true);
  };

  return (
    <div className="relative space-y-4 p-4 text-black bg-white rounded-3xl border-4 border-gray-100 shadow-xl">
      {/* 閉じるボタン */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-black text-xl font-bold p-2 transition-colors"
        >
          ✕
        </button>
      )}

      <h2 className="text-xl font-black text-center uppercase tracking-tighter pt-2">
        Avatar Custom
      </h2>

      {/* 保存完了ポップアップ */}
      {savedPopup && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center z-50 rounded-3xl">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl text-center space-y-4 border-4 border-green-500 scale-110">
            <p className="font-black text-green-600 text-2xl italic">SAVED!</p>
            <button
              onClick={() => {
                setSavedPopup(false);
                onClose?.();
              }}
              className="px-10 py-3 bg-green-500 text-white rounded-2xl font-black hover:bg-green-600 w-full transition-all active:scale-95 shadow-[0_4px_0_rgb(21,128,61)]"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* プレビュー表示: ID.png を直接表示 */}
      <div className="w-36 h-36 mx-auto rounded-[2rem] shadow-inner overflow-hidden flex items-center justify-center bg-gray-50 border-4 border-gray-100">
        <img
          src={`/avatars/${avatar.image}.png`}
          className="w-full h-full object-cover"
          alt="Preview"
        />
      </div>

      {/* キャラクター選択エリア */}
      <div className="space-y-3 bg-gray-50 p-4 rounded-[1.5rem]">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">
          Select Your Hero
        </p>
        <div className="grid grid-cols-3 gap-3">
          {avatarIds.map((id) => (
            <button
              key={id}
              onClick={() => setAvatar({ ...avatar, image: id })}
              className={`relative border-4 rounded-2xl p-2 transition-all overflow-hidden bg-white ${
                avatar.image === id
                  ? "border-green-500 bg-green-50 scale-105 shadow-md"
                  : "border-gray-200 opacity-60 hover:opacity-100 hover:border-gray-300"
              }`}
            >
              <img
                src={`/avatars/${id}.png`}
                className="w-full aspect-square object-cover rounded-lg"
                alt={`Char ${id}`}
              />
              <p className="text-[10px] mt-2 font-black text-gray-700 truncate">
                {CHARACTERS[id]?.name || `ID:${id}`}
              </p>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleSave}
        className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-700 shadow-[0_5px_0_rgb(30,58,138)] active:shadow-none active:translate-y-1 transition-all"
      >
        SAVE & PLAY
      </button>
    </div>
  );
}
