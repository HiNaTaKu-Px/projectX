import Link from "next/link";

export function GameCard({
  label,
  href,
  color,
  desc,
}: {
  label: string;
  href: string;
  color: string;
  desc: string;
}) {
  return (
    <div className="flex flex-col gap-2 p-4 border rounded-xl bg-white shadow">
      <Link href={href} className="w-full">
        <div
          className={`${color} w-full text-xl px-4 py-6 text-white font-bold rounded-xl shadow-lg transition cursor-pointer hover:opacity-80 text-center`}
        >
          {label}
        </div>
      </Link>
      <p className="text-sm text-gray-700">▶ {desc}</p>
    </div>
  );
}
