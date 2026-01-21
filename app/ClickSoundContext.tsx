"use client";

import { createContext, useContext, ReactNode } from "react"; // ← ここに注目！

type ClickSoundContextType = () => void;

const ClickSoundContext = createContext<ClickSoundContextType>(() => {});

export function ClickSoundProvider({ children }: { children: ReactNode }) {
  const playClick = () => {
    new Audio("/sounds/click.wav").play();
  };

  return (
    <ClickSoundContext.Provider value={playClick}>
      {children}
    </ClickSoundContext.Provider>
  );
}

export function useClickSound() {
  return useContext(ClickSoundContext);
}
