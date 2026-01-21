// src/components/SoundButton.tsx
"use client";

import { ButtonHTMLAttributes } from "react";
import { useClickSound } from "../app/ClickSoundContext";

type Props = ButtonHTMLAttributes<HTMLButtonElement>;

export default function SoundButton(props: Props) {
  const playClick = useClickSound();

  return (
    <button
      {...props}
      onClick={(e) => {
        playClick();
        props.onClick?.(e);
      }}
    >
      {props.children}
    </button>
  );
}
