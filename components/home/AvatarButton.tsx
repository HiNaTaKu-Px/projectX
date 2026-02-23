"use client";

export function AvatarButton({
  user,
  onClick,
}: {
  user: any;
  onClick: () => void;
}) {
  if (!user) return null;

  return (
    <button
      onClick={onClick}
      className="fixed mt-3 left-5 z-50 rounded-full shadow hover:opacity-80 transition"
    >
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: user.avatar?.bg ?? "#ccc" }}
      >
        {user.avatar?.mode === "image" ? (
          <img
            src={`/avatars/${user.avatar.image}.png`}
            className="w-full h-full object-cover"
          />
        ) : (
          <svg width="40" height="40" viewBox="0 0 100 100">
            <circle cx="50" cy="30" r="20" fill={user.avatar?.hair ?? "#000"} />
            <rect
              x="30"
              y="50"
              width="40"
              height="40"
              fill={user.avatar?.clothes ?? "#fff"}
            />
          </svg>
        )}
      </div>
    </button>
  );
}
