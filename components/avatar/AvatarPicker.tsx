"use client";

import { useState } from "react";

type Avatar = {
  mode: "color" | "image"; // ← モード追加
  hair: string;
  clothes: string;
  bg: string;
  image: string; // ← 画像モード用
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
      mode: "color",
      hair: "#000000",
      clothes: "#ffffff",
      bg: "#cccccc",
      image: "1n",
    },
  );

  const [savedPopup, setSavedPopup] = useState(false);

  // カラー候補
  const colors = [
    "#ffcc00",
    "#ff6699",
    "#66ccff",
    "#00cc66",
    "#333333",
    "#ffffff",
  ];

  // ★ セットごとにまとめた画像
  const avatarSets = [
    ["1n", "1h", "1c", "1a"],
    ["2n", "2h", "2c", "2a"],
    ["3n", "3h", "3c", "3a"],
  ];

  const update = (key: keyof Avatar, value: string) => {
    setAvatar({ ...avatar, [key]: value });
  };

  const handleSave = () => {
    onSave(avatar);
    setSavedPopup(true);
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

      {/* 保存ポップアップ */}
      {savedPopup && (
        <div className="absolute inset-0 bg-white bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg text-center space-y-3 w-48">
            <p className="font-bold text-green-600">保存しました！</p>
            <button
              onClick={() => {
                setSavedPopup(false);
                onClose?.();
              }}
              className="px-4 py-2 bg-green-500 text-white rounded-md font-bold hover:bg-green-600"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* ★ モード切り替え */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setAvatar({ ...avatar, mode: "color" })}
          className={`px-4 py-2 rounded-md font-bold ${
            avatar.mode === "color" ? "bg-green-500 text-white" : "bg-gray-200"
          }`}
        >
          カラー
        </button>
        <button
          onClick={() => setAvatar({ ...avatar, mode: "image" })}
          className={`px-4 py-2 rounded-md font-bold ${
            avatar.mode === "image" ? "bg-green-500 text-white" : "bg-gray-200"
          }`}
        >
          画像
        </button>
      </div>

      {/* ★ プレビュー */}
      <div className="w-32 h-32 mx-auto rounded-full shadow overflow-hidden flex items-center justify-center bg-white">
        {avatar.mode === "color" ? (
          <div
            className="relative w-full h-full"
            style={{ backgroundColor: avatar.bg }}
          >
            <svg width="100%" height="100%" viewBox="0 0 100 100">
              <circle cx="50" cy="30" r="20" fill={avatar.hair} />
              <rect
                x="30"
                y="50"
                width="40"
                height="40"
                fill={avatar.clothes}
              />
            </svg>
          </div>
        ) : (
          <img
            src={`/avatars/${avatar.image}.png`}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* ★ カラーモード */}
      {avatar.mode === "color" && (
        <>
          {/* 髪色 */}
          <div className="space-y-2">
            <p className="font-bold">髪色</p>
            <div className="flex gap-2">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => update("hair", c)}
                  className="w-12 h-12 border rounded p-1"
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
                  className="w-12 h-12 border rounded p-1"
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
                  className="w-12 h-12 border rounded p-1"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {/* ★ 画像モード（セットを縦に並べて3列） */}
      {avatar.mode === "image" && (
        <div className="space-y-2">
          <p className="font-bold">アバター画像を選択</p>

          <div className="grid grid-cols-3 gap-3">
            {avatarSets.map((set, colIndex) => (
              <div key={colIndex} className="flex flex-col gap-2 items-start">
                {set.map((img) => (
                  <button
                    key={img}
                    onClick={() => setAvatar({ ...avatar, image: img })}
                    className={`border rounded p-1 ${
                      avatar.image === img
                        ? "border-green-500"
                        : "border-gray-300"
                    }`}
                  >
                    <img
                      src={`/avatars/${img}.png`}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleSave}
        className="w-full bg-green-500 text-white py-2 rounded-md font-bold hover:bg-green-600"
      >
        保存する
      </button>
    </div>
  );
}
