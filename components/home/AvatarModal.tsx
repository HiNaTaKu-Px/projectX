"use client";

import { AvatarPicker } from "@/components/avatar/AvatarPicker";

export function AvatarModal({
  open,
  user,
  onSave,
  onClose,
}: {
  open: boolean;
  user: any;
  onSave: (avatar: any) => void;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-green-50 bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white p-4 rounded-xl shadow-xl w-80">
        <AvatarPicker
          initial={user?.avatar}
          onSave={onSave}
          onClose={onClose}
        />
      </div>
    </div>
  );
}
