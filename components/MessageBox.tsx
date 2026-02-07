"use client";

type Props = {
  message: string;
  visible: boolean;
};

export default function MessageBox({ message, visible }: Props) {
  return (
    <div
      className={`text-center font-bold text-green-600 mt-4 transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {message}
    </div>
  );
}
