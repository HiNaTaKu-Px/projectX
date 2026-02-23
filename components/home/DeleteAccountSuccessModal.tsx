"use client";

export function DeleteAccountSuccessModal({
  onClose,
}: {
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[9999]">
      <div className="bg-white p-6 rounded-xl shadow-xl w-72 text-center space-y-4">
        <h2 className="text-xl font-bold text-red-600">アカウント削除完了</h2>

        <button
          onClick={onClose}
          className="w-full bg-green-500 text-white py-2 rounded-md font-bold hover:bg-green-600"
        >
          OK
        </button>
      </div>
    </div>
  );
}
