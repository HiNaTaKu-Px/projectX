export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // ヘッダーを削除し、children（ページの中身）だけを返す
    // 画面いっぱいに広げたい場合は、ここで背景色やサイズを指定すると安定します
    <div className="min-h-screen w-full bg-black">
      <main>{children}</main>
    </div>
  );
}