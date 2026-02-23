"use client";

import { useState } from "react";
import { deletePostAction } from "@/lib/actions/delete";
import { ConfirmModal } from "@/components/home/ConfirmModal";
import { useRouter } from "next/navigation";

export function DeleteButton({ postId }: { postId: number }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-red-600 font-bold hover:underline"
      >
        削除
      </button>

      {open && (
        <ConfirmModal
          type="deletePost"
          onConfirm={async () => {
            await deletePostAction(postId);
            setOpen(false);
            router.refresh();
          }}
          onCancel={() => setOpen(false)}
        />
      )}
    </>
  );
}
