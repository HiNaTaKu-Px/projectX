"use client";

import { ReactNode } from "react";
import BgmPlayerClick from "@/components/sounds/BgmPlayerClick"; // ← クリックゲーム専用BGM！

export default function ClickGameLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <BgmPlayerClick />
      {children}
    </>
  );
}
