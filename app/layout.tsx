import "./globals.css";
import Header from "@/components/layout/Header";

export const metadata = {
  icons: {
    icon: "/favicon.ico",
  },
};

type LayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="ja">
      <body className="m-0 p-0 overflow-auto bg-gray-700">
        <Header />
        {children}
      </body>
    </html>
  );
}
