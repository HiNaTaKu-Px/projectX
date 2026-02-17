export function SectionBox({ children }: { children: React.ReactNode }) {
  return (
    <section className="w-full max-w-4xl mx-auto p-4 space-y-4 border-2 border-green-200 rounded-xl bg-gray-50 mb-2">
      {children}
    </section>
  );
}
