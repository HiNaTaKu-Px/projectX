"use client";

import { usePathname, useRouter } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const hideHeader = pathname === "/";

  if (hideHeader) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <header className="w-full bg-gray-700 text-white p-0 shadow-lg flex items-center">
        <button
          onClick={() => router.push("/")}
          className="text-lg font-bold hover:opacity-70 transition"
        >
          ← ホーム
        </button>
      </header>
    </div>
  );
}
