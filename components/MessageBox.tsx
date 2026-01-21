"use client"; // ← これが必要！

import { useRef, useEffect } from "react";

type Props = {
  message: string;
  visible: boolean;
};

export default function MessageBox({ message, visible }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visible && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [message, visible]);

  return (
    <div
      ref={ref}
      className={`text-center font-bold text-green-600 mt-4 transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {message}
    </div>
  );
}
