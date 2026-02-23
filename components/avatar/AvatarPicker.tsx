"use client";

import { useState } from "react";

type Avatar = {
  hair: string;
  clothes: string;
  bg: string;
};

export function AvatarPicker({
  initial,
  onSave,
  onClose,
}: {
  initial?: Avatar;
  onSave: (a: Avatar) => void;
  onClose?: () => void;
}) {
  const [avatar, setAvatar] = useState<Avatar>(
    initial ?? {
      hair: "#000000",
      clothes: "#ffffff",
      bg: "#cccccc",
    },
  );

  const [savedPopup, setSavedPopup] = useState(false); // ← ★ ポップアップ用

  const colors = [
    "#ffcc00",
    "#ff6699",
    "#66ccff",
    "#00cc66",
    "#333333",
    "#ffffff",
  ];

  const update = (key: keyof Avatar, value: string) => {
    setAvatar({ ...avatar, [key]: value });
  };

  const handleSave = () => {
    onSave(avatar);
    setSavedPopup(true); // ← ★ ポップアップ表示
  };

  return (
    <div className="relative space-y-4 p-4">
      {/* 閉じるボタン */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl font-bold"
        >
          ✕
        </button>
      )}

      <h2 className="text-xl font-bold text-center">アバターカスタム</h2>

      {/* ★ 保存しましたポップアップ */}
      {savedPopup && (
        <div className="absolute inset-0 bg-white bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg text-center space-y-3 w-48">
            <p className="font-bold text-green-600">保存しました！</p>
            <button
              onClick={() => {
                setSavedPopup(false);
                onClose?.(); // ← ★ OKで閉じる
              }}
              className="px-4 py-2 bg-green-500 text-white rounded-md font-bold hover:bg-green-600"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* プレビュー */}
      <div
        className="w-24 h-24 mx-auto rounded-full flex items-center justify-center shadow"
        style={{ backgroundColor: avatar.bg }}
      >
        <svg width="50" height="50" viewBox="0 0 100 100">
          <circle cx="50" cy="30" r="20" fill={avatar.hair} />
          <rect x="30" y="50" width="40" height="40" fill={avatar.clothes} />
        </svg>
      </div>

      {/* 髪色 */}
      <div className="space-y-2">
        <p className="font-bold">髪色</p>
        <div className="flex gap-2">
          {colors.map((c) => (
            <button
              key={c}
              onClick={() => update("hair", c)}
              className="w-8 h-8 rounded-full border"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      {/* 服 */}
      <div className="space-y-2">
        <p className="font-bold">服の色</p>
        <div className="flex gap-2">
          {colors.map((c) => (
            <button
              key={c}
              onClick={() => update("clothes", c)}
              className="w-8 h-8 rounded-full border"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      {/* 背景 */}
      <div className="space-y-2">
        <p className="font-bold">背景色</p>
        <div className="flex gap-2">
          {colors.map((c) => (
            <button
              key={c}
              onClick={() => update("bg", c)}
              className="w-8 h-8 rounded-full border"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      <button
        onClick={handleSave}
        className="w-full bg-green-500 text-white py-2 rounded-md font-bold hover:bg-green-600"
      >
        保存する
      </button>
    </div>
  );
}
